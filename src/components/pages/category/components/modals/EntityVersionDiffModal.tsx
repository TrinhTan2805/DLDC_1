import { useState } from 'react';
import { GitCompare, ArrowRight } from 'lucide-react';
import { BaseModal } from '../../../../common/BaseModal';

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
  '1-n': 'bg-blue-50 text-blue-700 border-blue-200',
  'n-1': 'bg-indigo-50 text-indigo-700 border-indigo-200',
  'n-n': 'bg-purple-50 text-purple-700 border-purple-200',
  '1-1': 'bg-teal-50 text-teal-700 border-teal-200',
};

export function EntityVersionDiffModal({ isOpen, onClose, entityName, diff }: Props) {
  const [activeTab, setActiveTab] = useState<DiffTab>('structure');

  if (!isOpen) return null;

  const { prevVersion, currentVersion, generalRows, structureRows, relationshipRows } = diff;

  const tabs: { key: DiffTab; label: string; count: number }[] = [
    { key: 'structure',    label: 'Cấu trúc',       count: structureRows.filter(r => r.changeType !== 'unchanged').length },
    { key: 'general',     label: 'Thông tin chung', count: generalRows.length },
    { key: 'relationship',label: 'Quan hệ',         count: relationshipRows.filter(r => r.changeType !== 'unchanged').length },
  ];

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="So sánh phiên bản danh mục"
      subtitle={entityName}
      maxWidth="max-w-5xl"
      customHeaderIcon={
        <div className="w-9 h-9 rounded-xl bg-indigo-50 flex items-center justify-center mr-3 shrink-0">
          <GitCompare className="w-5 h-5 text-indigo-600" />
        </div>
      }
      footer={
        <button
          onClick={onClose}
          className="px-6 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 transition-all text-[13px]"
        >
          Đóng so sánh
        </button>
      }
    >
      <div className="space-y-5">

        {/* Entity & Version Banner */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2">
          <div className="text-[13px] text-slate-500">Danh mục được so sánh</div>
          <div className="text-[13px] font-semibold text-slate-800">{entityName}</div>
          <div className="flex items-center gap-3 mt-2">
            <span className="px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-[13px] font-semibold text-slate-600 shadow-sm">
              Phiên bản cũ &nbsp; v{prevVersion}.0
            </span>
            <ArrowRight className="w-4 h-4 text-slate-400 shrink-0" />
            <span className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-[13px] font-semibold shadow-sm">
              Phiên bản mới &nbsp; v{currentVersion}.0
            </span>
          </div>
        </div>

        {/* Change-type Tabs */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl w-fit">
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2 rounded-lg text-[13px] transition-all flex items-center gap-2 ${
                activeTab === tab.key
                  ? 'bg-white text-blue-600 shadow-sm font-medium'
                  : 'text-slate-600 hover:bg-slate-200'
              }`}
            >
              {tab.label}
              {tab.count > 0 && (
                <span className={`px-1.5 py-0.5 rounded-full text-[11px] font-bold ${
                  activeTab === tab.key ? 'bg-blue-100 text-blue-700' : 'bg-slate-200 text-slate-600'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* ── STRUCTURE TAB ─────────────────────────────────── */}
        {activeTab === 'structure' && (
          <div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-[13px]">
                <thead>
                  <tr>
                    <th colSpan={2} className="px-5 py-3 bg-slate-100 border-b border-r border-slate-200 text-[13px] font-semibold text-slate-600">
                      <div className="flex items-center justify-between">
                        <span>PHIÊN BẢN CŨ (v{prevVersion}.0)</span>
                        <span className="px-2 py-0.5 bg-white border border-slate-300 rounded text-[11px] text-slate-500 font-normal">Trước cập nhật</span>
                      </div>
                    </th>
                    <th colSpan={2} className="px-5 py-3 bg-blue-50 border-b border-slate-200 text-[13px] font-semibold text-blue-700">
                      <div className="flex items-center justify-between">
                        <span>PHIÊN BẢN MỚI (v{currentVersion}.0)</span>
                        <span className="px-2 py-0.5 bg-blue-600 text-white rounded text-[11px] font-normal">Sau cập nhật</span>
                      </div>
                    </th>
                  </tr>
                  <tr className="bg-[#f8fafc] border-b border-slate-200">
                    <th className="px-5 py-3 text-[13px] font-semibold text-slate-600 border-r border-slate-100 w-[22%]">Trường thuộc tính</th>
                    <th className="px-5 py-3 text-[13px] font-semibold text-slate-600 border-r border-slate-200 w-[28%]">Kiểu dữ liệu</th>
                    <th className="px-5 py-3 text-[13px] font-semibold text-slate-600 border-r border-slate-100 w-[22%]">Trường thuộc tính</th>
                    <th className="px-5 py-3 text-[13px] font-semibold text-slate-600 w-[28%]">Kiểu dữ liệu</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {structureRows.map((row, i) => {
                    if (row.changeType === 'added') {
                      return (
                        <tr key={i} className="bg-emerald-50/40">
                          <td colSpan={2} className="px-5 py-3.5 text-center italic text-slate-400 text-[13px] border-r border-slate-200">
                            (Không tồn tại ở phiên bản cũ v{prevVersion}.0)
                          </td>
                          <td className="px-5 py-3.5 font-semibold text-emerald-700 border-r border-slate-100">
                            <code className="font-mono text-[13px]">{row.fieldName}</code>
                            {row.displayName && <div className="text-[12px] text-emerald-600 font-normal mt-0.5">{row.displayName}</div>}
                          </td>
                          <td className="px-5 py-3.5 text-emerald-700 text-[13px]">{row.newDataType || '--'}</td>
                        </tr>
                      );
                    }
                    if (row.changeType === 'removed') {
                      return (
                        <tr key={i} className="bg-red-50/30">
                          <td className="px-5 py-3.5 border-r border-slate-100">
                            <code className="font-mono text-[13px] line-through text-slate-400">{row.fieldName}</code>
                            {row.displayName && <div className="text-[12px] text-slate-400 mt-0.5 line-through">{row.displayName}</div>}
                          </td>
                          <td className="px-5 py-3.5 text-[13px] text-slate-400 line-through border-r border-slate-200">{row.oldDataType || '--'}</td>
                          <td colSpan={2} className="px-5 py-3.5 text-center italic text-slate-400 text-[13px]">
                            (Đã lược bỏ ở phiên bản mới v{currentVersion}.0)
                          </td>
                        </tr>
                      );
                    }
                    if (row.changeType === 'modified') {
                      const typeChanged = row.oldDataType !== row.newDataType;
                      return (
                        <tr key={i} className="bg-amber-50/30">
                          <td className="px-5 py-3.5 border-r border-slate-100">
                            <code className="font-mono text-[13px] text-slate-700 font-semibold">{row.fieldName}</code>
                            {row.displayName && <div className="text-[12px] text-slate-500 mt-0.5">{row.displayName}</div>}
                          </td>
                          <td className="px-5 py-3.5 border-r border-slate-200">
                            <span className={`text-[13px] ${typeChanged ? 'line-through text-red-400' : 'text-slate-600'}`}>{row.oldDataType || '--'}</span>
                            {row.oldExtra && <div className="text-[12px] text-red-400 line-through mt-0.5">{row.oldExtra}</div>}
                          </td>
                          <td className="px-5 py-3.5 border-r border-slate-100">
                            <code className="font-mono text-[13px] text-slate-700 font-semibold">{row.fieldName}</code>
                            {row.displayName && <div className="text-[12px] text-slate-500 mt-0.5">{row.displayName}</div>}
                          </td>
                          <td className="px-5 py-3.5">
                            <span className={`text-[13px] ${typeChanged ? 'font-semibold text-emerald-700' : 'text-slate-600'}`}>{row.newDataType || '--'}</span>
                            {row.newExtra && <div className="text-[12px] text-emerald-600 font-medium mt-0.5">{row.newExtra}</div>}
                          </td>
                        </tr>
                      );
                    }
                    // unchanged
                    return (
                      <tr key={i} className="hover:bg-slate-50/50">
                        <td className="px-5 py-3.5 border-r border-slate-100">
                          <code className="font-mono text-[13px] text-slate-700">{row.fieldName}</code>
                          {row.displayName && <div className="text-[12px] text-slate-400 mt-0.5">{row.displayName}</div>}
                        </td>
                        <td className="px-5 py-3.5 text-[13px] text-slate-600 border-r border-slate-200">{row.oldDataType || '--'}</td>
                        <td className="px-5 py-3.5 border-r border-slate-100">
                          <code className="font-mono text-[13px] text-slate-700">{row.fieldName}</code>
                          {row.displayName && <div className="text-[12px] text-slate-400 mt-0.5">{row.displayName}</div>}
                        </td>
                        <td className="px-5 py-3.5 text-[13px] text-slate-600">{row.newDataType || '--'}</td>
                      </tr>
                    );
                  })}
                  {structureRows.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-5 py-8 text-center text-[13px] text-slate-400 italic">Không có thay đổi cấu trúc</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── GENERAL INFO TAB ──────────────────────────────── */}
        {activeTab === 'general' && (
          <div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-[13px]">
                <thead>
                  <tr className="bg-[#f8fafc] border-b border-slate-200">
                    <th className="px-5 py-3 text-[13px] font-semibold text-slate-600 w-[30%]">Trường thông tin</th>
                    <th className="px-5 py-3 text-[13px] font-semibold text-slate-600 border-l border-slate-200 w-[35%]">
                      <div className="flex items-center gap-2">
                        <span>Phiên bản cũ (v{prevVersion}.0)</span>
                        <span className="px-1.5 py-0.5 bg-slate-200 text-slate-500 rounded text-[11px] font-normal">Trước cập nhật</span>
                      </div>
                    </th>
                    <th className="px-5 py-3 text-[13px] font-semibold text-blue-700 border-l border-slate-200 bg-blue-50/50 w-[35%]">
                      <div className="flex items-center gap-2">
                        <span>Phiên bản mới (v{currentVersion}.0)</span>
                        <span className="px-1.5 py-0.5 bg-blue-600 text-white rounded text-[11px] font-normal">Sau cập nhật</span>
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {generalRows.map((row, i) => {
                    const changed = row.oldValue !== row.newValue;
                    return (
                      <tr key={i} className={changed ? 'bg-amber-50/30' : 'hover:bg-slate-50/50'}>
                        <td className="px-5 py-3.5 text-[13px] font-medium text-slate-700">{row.label}</td>
                        <td className={`px-5 py-3.5 text-[13px] border-l border-slate-100 ${changed ? 'text-red-500 line-through' : 'text-slate-600'}`}>
                          {row.oldValue || '--'}
                        </td>
                        <td className={`px-5 py-3.5 text-[13px] border-l border-slate-100 ${changed ? 'text-emerald-700 font-semibold' : 'text-slate-600'}`}>
                          {row.newValue || '--'}
                        </td>
                      </tr>
                    );
                  })}
                  {generalRows.length === 0 && (
                    <tr>
                      <td colSpan={3} className="px-5 py-8 text-center text-[13px] text-slate-400 italic">Không có thay đổi thông tin chung</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── RELATIONSHIP TAB ──────────────────────────────── */}
        {activeTab === 'relationship' && (
          <div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-[13px]">
                <thead>
                  <tr>
                    <th colSpan={3} className="px-5 py-3 bg-slate-100 border-b border-r border-slate-200 text-[13px] font-semibold text-slate-600">
                      <div className="flex items-center justify-between">
                        <span>PHIÊN BẢN CŨ (v{prevVersion}.0)</span>
                        <span className="px-2 py-0.5 bg-white border border-slate-300 rounded text-[11px] text-slate-500 font-normal">Trước cập nhật</span>
                      </div>
                    </th>
                    <th colSpan={3} className="px-5 py-3 bg-blue-50 border-b border-slate-200 text-[13px] font-semibold text-blue-700">
                      <div className="flex items-center justify-between">
                        <span>PHIÊN BẢN MỚI (v{currentVersion}.0)</span>
                        <span className="px-2 py-0.5 bg-blue-600 text-white rounded text-[11px] font-normal">Sau cập nhật</span>
                      </div>
                    </th>
                  </tr>
                  <tr className="bg-[#f8fafc] border-b border-slate-200">
                    <th className="px-5 py-3 text-[13px] font-semibold text-slate-600 border-r border-slate-100">Danh mục nguồn</th>
                    <th className="px-5 py-3 text-[13px] font-semibold text-slate-600 border-r border-slate-100">Danh mục đích</th>
                    <th className="px-5 py-3 text-[13px] font-semibold text-slate-600 border-r border-slate-200">Loại</th>
                    <th className="px-5 py-3 text-[13px] font-semibold text-slate-600 border-r border-slate-100">Danh mục nguồn</th>
                    <th className="px-5 py-3 text-[13px] font-semibold text-slate-600 border-r border-slate-100">Danh mục đích</th>
                    <th className="px-5 py-3 text-[13px] font-semibold text-slate-600">Loại</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {relationshipRows.map((row, i) => {
                    const relBadge = (t?: string) => t
                      ? <span className={`px-1.5 py-0.5 rounded border text-[12px] font-semibold ${relTypeColors[t] || 'bg-slate-50 text-slate-600 border-slate-200'}`}>{t}</span>
                      : <span className="text-slate-400 text-[13px]">--</span>;

                    if (row.changeType === 'added') return (
                      <tr key={i} className="bg-emerald-50/40">
                        <td colSpan={3} className="px-5 py-3.5 text-center italic text-slate-400 text-[13px] border-r border-slate-200">
                          (Không tồn tại ở phiên bản cũ v{prevVersion}.0)
                        </td>
                        <td className="px-5 py-3.5 text-[13px] text-emerald-700 font-medium border-r border-slate-100">{row.sourceEntity}</td>
                        <td className="px-5 py-3.5 text-[13px] text-emerald-700 font-medium border-r border-slate-100">{row.targetEntity}</td>
                        <td className="px-5 py-3.5">{relBadge(row.newRelType)}</td>
                      </tr>
                    );
                    if (row.changeType === 'removed') return (
                      <tr key={i} className="bg-red-50/30">
                        <td className="px-5 py-3.5 text-[13px] text-slate-400 line-through border-r border-slate-100">{row.sourceEntity}</td>
                        <td className="px-5 py-3.5 text-[13px] text-slate-400 line-through border-r border-slate-100">{row.targetEntity}</td>
                        <td className="px-5 py-3.5 border-r border-slate-200">{relBadge(row.oldRelType)}</td>
                        <td colSpan={3} className="px-5 py-3.5 text-center italic text-slate-400 text-[13px]">
                          (Đã lược bỏ ở phiên bản mới v{currentVersion}.0)
                        </td>
                      </tr>
                    );
                    if (row.changeType === 'modified') {
                      const typeChanged = row.oldRelType !== row.newRelType;
                      return (
                        <tr key={i} className="bg-amber-50/30">
                          <td className="px-5 py-3.5 text-[13px] text-slate-700 font-medium border-r border-slate-100">{row.sourceEntity}</td>
                          <td className="px-5 py-3.5 text-[13px] text-slate-700 border-r border-slate-100">{row.targetEntity}</td>
                          <td className="px-5 py-3.5 border-r border-slate-200">
                            {typeChanged ? <span className="line-through text-red-400 text-[13px]">{row.oldRelType}</span> : relBadge(row.oldRelType)}
                          </td>
                          <td className="px-5 py-3.5 text-[13px] text-emerald-700 font-medium border-r border-slate-100">{row.sourceEntity}</td>
                          <td className="px-5 py-3.5 text-[13px] text-emerald-700 border-r border-slate-100">{row.targetEntity}</td>
                          <td className="px-5 py-3.5">{relBadge(row.newRelType)}</td>
                        </tr>
                      );
                    }
                    return (
                      <tr key={i} className="hover:bg-slate-50/50">
                        <td className="px-5 py-3.5 text-[13px] text-slate-700 border-r border-slate-100">{row.sourceEntity}</td>
                        <td className="px-5 py-3.5 text-[13px] text-slate-700 border-r border-slate-100">{row.targetEntity}</td>
                        <td className="px-5 py-3.5 border-r border-slate-200">{relBadge(row.oldRelType)}</td>
                        <td className="px-5 py-3.5 text-[13px] text-slate-700 border-r border-slate-100">{row.sourceEntity}</td>
                        <td className="px-5 py-3.5 text-[13px] text-slate-700 border-r border-slate-100">{row.targetEntity}</td>
                        <td className="px-5 py-3.5">{relBadge(row.newRelType)}</td>
                      </tr>
                    );
                  })}
                  {relationshipRows.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-5 py-8 text-center text-[13px] text-slate-400 italic">Không có thay đổi quan hệ</td>
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
