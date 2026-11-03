import { useState, type ReactNode } from 'react';
import { ArrowLeft, Play, RefreshCw, SquarePen, Eye, LayoutGrid, ArrowLeftRight, History, Table2, Eraser, KeyRound, Clock, Search, Trash2 } from 'lucide-react';
import { Tooltip, TooltipTrigger, TooltipContent } from '../../../ui/tooltip';
import { BaseModal } from '../../../common/BaseModal';
import {
  Badge, TruncatedText, BTN_OUTLINE, BTN_GHOST_ICON, BTN_FOCUS, RowIconAction, TOOLTIP_CLS, FIELD_LABEL, FIELD_VALUE, SECTION_TITLE,
  TABLE_HEAD_BG, TABLE_HEAD_ROW_CLS, TABLE_WRAP_CLS, CARD_CLS, tabClass, SEARCH_INPUT_CLS, SEARCH_BTN_CLS, Pagination, normalizeSearch,
} from '../../collection/collectionUi';
import { initialTargetDatabases } from '../mockTargetDatabases';
import {
  MergeConfig, MergeRunLog, findDataset, getSourceGroup, mergeTargetTables, TECH_COLUMNS, describeRule, ruleGroupOf, RULE_KINDS, RULE_GROUP_LABEL, sourceKeyOf, MERGE_SAMPLE_DATA, ONE_TO_MANY_LABEL,
  JOIN_TYPE_LABEL, VALUE_MODE_LABEL, DUPLICATE_RULE_LABEL, combineFamily, describeOn, describeWhere, describeMapping, mappingFilled, columnLabel, operandLabel, unionLabel,
  MERGE_STATUS_LABEL, MERGE_STATUS_VARIANT, mergeActionReasons, RUN_RESULT_LABEL, RUN_RESULT_VARIANT, RUN_ACTIVITY_LABEL, RUN_ACTIVITY_VARIANT,
} from './mockDataMerge';

interface DataMergeDetailProps {
  config: MergeConfig;
  runs: MergeRunLog[];
  onBack: () => void;
  onEdit: () => void;
  onRun: () => void;
  onClearData: () => void;
  onSchedule: () => void;
}

type DetailTab = 'overview' | 'rules' | 'mapping' | 'data' | 'history';

const TH = 'px-3 py-[13px] leading-4 text-left font-bold text-black whitespace-nowrap text-[13px]';
const TD = 'px-3 py-1 text-left text-black text-[13px]';
const ROW = 'h-12 bg-white border-b border-[#E0E0E0] hover:bg-[#F8FAFC] transition-colors';

const KV = ({ label, children }: { label: string; children: ReactNode }) => (
  <div className="space-y-1">
    <div className={FIELD_LABEL}>{label}</div>
    <div className={FIELD_VALUE}>{children}</div>
  </div>
);

const sum = (r: MergeRunLog, k: 'inserted' | 'updated' | 'deleted' | 'unmatched') => r.perSource.reduce((t, s) => t + (s[k] || 0), 0);
const fmt = (n: number) => n.toLocaleString('vi-VN');

export function DataMergeDetail({ config, runs, onBack, onEdit, onRun, onClearData, onSchedule }: DataMergeDetailProps) {
  const [tab, setTab] = useState<DetailTab>('overview');
  const [runDetail, setRunDetail] = useState<MergeRunLog | null>(null);
  // Tab Lịch sử chạy: tìm kiếm áp dụng khi Enter / bấm nút (mục 5.19)
  const [historyKeyword, setHistoryKeyword] = useState('');
  const [historyApplied, setHistoryApplied] = useState('');
  const [historyPage, setHistoryPage] = useState(1);
  const [historyPageSize, setHistoryPageSize] = useState(10);
  const hasJoin = config.combineType === 'join';
  const family = combineFamily(config);
  const whereText = describeWhere(config);
  const db = initialTargetDatabases.find(d => d.id === config.targetDbId);
  const knownTable = mergeTargetTables.find(t => t.dbId === config.targetDbId && t.name === config.targetTable);
  const targetCols = knownTable?.columns || config.newTableColumns || [];
  const keyColumns = targetCols.filter(c => c.isKey).map(c => c.name);
  const lastRun = runs.find(r => r.activity !== 'clear'); // lần chạy gần nhất có số liệu theo nguồn
  const targetKeyText = `${keyColumns.join(', ') || '-'} = ${config.targetKey.mode === 'auto' ? 'Tự động' : columnLabel(config, config.targetKey.column) || '-'}`;
  const sample = MERGE_SAMPLE_DATA[config.id];
  const historyRows = runs.filter(r => {
    const q = normalizeSearch(historyApplied);
    return !q || normalizeSearch(`${r.id} ${RUN_ACTIVITY_LABEL[r.activity]} ${r.createdBy} ${r.createdAt} ${RUN_RESULT_LABEL[r.result]}`).includes(q);
  });
  const historyPageItems = historyRows.slice((historyPage - 1) * historyPageSize, historyPage * historyPageSize);
  const runHistory = () => { setHistoryApplied(historyKeyword); setHistoryPage(1); };

  const hasData = config.dataCount > 0;
  // Bộ nút theo màn Xử lý dữ liệu: Chuyển đổi dữ liệu · Cập nhật dữ liệu · Xóa dữ liệu · Thêm lịch biểu (quy tắc bật / khóa dùng chung)
  const reasons = mergeActionReasons(config);
  const toolButtons: { label: string; icon: ReactNode; tone: string; onClick: () => void; disabledReason?: string }[] = [
    { label: 'Chuyển đổi dữ liệu', icon: <Play className="w-5 h-5" />, tone: 'bg-emerald-50 text-emerald-600 border-emerald-200 hover:bg-emerald-100', onClick: onRun,
      disabledReason: reasons.convert },
    { label: 'Cập nhật dữ liệu', icon: <RefreshCw className="w-5 h-5" />, tone: 'bg-indigo-50 text-indigo-600 border-indigo-200 hover:bg-indigo-100', onClick: onRun,
      disabledReason: reasons.update },
    { label: 'Xóa dữ liệu', icon: <Trash2 className="w-5 h-5" />, tone: 'bg-red-50 text-red-600 border-red-200 hover:bg-red-100', onClick: onClearData,
      disabledReason: reasons.clear },
    { label: 'Thêm lịch biểu', icon: <Clock className="w-5 h-5" />, tone: 'bg-amber-50 text-amber-600 border-amber-200 hover:bg-amber-100', onClick: onSchedule, disabledReason: reasons.schedule },
  ];

  return (
    <div className="space-y-4">
      {/* Đầu trang chi tiết */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-2 min-w-0">
          <button type="button" onClick={onBack} aria-label="Quay lại danh sách" className={BTN_GHOST_ICON}>
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-[16px] font-semibold text-[#020817]">{config.name}</h2>
              <Badge label={MERGE_STATUS_LABEL[config.status]} variant={MERGE_STATUS_VARIANT[config.status]} />
            </div>
            <div className="text-[13px] text-[#64748B] mt-0.5">
              {config.code} · {family || 'Chưa thiết lập kết hợp'} · {db?.name} / <span className="font-mono">{config.targetTable}</span> · {hasData ? `${config.dataCount.toLocaleString('vi-VN')} bản ghi` : 'Chưa có dữ liệu'}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <button type="button" onClick={onEdit} className={BTN_OUTLINE}>
            <SquarePen className="w-4 h-4" /> Chỉnh sửa
          </button>
          <div className="w-px h-6 bg-[#E2E8F0] mx-1" />
          {toolButtons.map(t => (
            <Tooltip key={t.label}>
              <TooltipTrigger asChild>
                <span tabIndex={t.disabledReason ? 0 : -1} className="inline-flex rounded-lg">
                  <button type="button" aria-label={t.label} onClick={t.onClick} disabled={!!t.disabledReason}
                    className={`w-10 h-10 inline-flex items-center justify-center rounded-lg border transition-colors ${BTN_FOCUS} disabled:opacity-40 disabled:cursor-not-allowed ${t.tone}`}>
                    {t.icon}
                  </button>
                </span>
              </TooltipTrigger>
              <TooltipContent side="top" sideOffset={4} className={TOOLTIP_CLS}>{t.disabledReason ? `${t.label}: ${t.disabledReason}` : t.label}</TooltipContent>
            </Tooltip>
          ))}
        </div>
      </div>

      {/* Tab (mục 5.9) */}
      <div className="flex border-b border-[#E2E8F0]">
        <button type="button" className={tabClass(tab === 'overview')} onClick={() => setTab('overview')}><LayoutGrid className="w-5 h-5" /> Tổng quan</button>
        <button type="button" className={tabClass(tab === 'rules')} onClick={() => setTab('rules')}><Eraser className="w-5 h-5" /> Xử lý nguồn</button>
        <button type="button" className={tabClass(tab === 'mapping')} onClick={() => setTab('mapping')}><ArrowLeftRight className="w-5 h-5" /> Ánh xạ</button>
        <button type="button" className={tabClass(tab === 'data')} onClick={() => setTab('data')}><Table2 className="w-5 h-5" /> Dữ liệu đích</button>
        <button type="button" className={tabClass(tab === 'history')} onClick={() => setTab('history')}><History className="w-5 h-5" /> Lịch sử chạy</button>
      </div>

      {tab === 'overview' && (
        <div className="space-y-4">
          <div className={CARD_CLS}>
            <h4 className={SECTION_TITLE}>Thông tin chung</h4>
            <div className="grid grid-cols-3 gap-x-6 gap-y-4">
              <KV label="Mã cấu hình">{config.code}</KV>
              <KV label="Loại kết hợp">
                {family ? <Badge label={hasJoin ? 'JOIN' : unionLabel(config.unionAll).toUpperCase()} variant={hasJoin ? 'indigo' : 'emerald'} /> : '-'}
              </KV>
              <KV label="Loại nguồn"><Badge label={getSourceGroup(config.sources)} variant="slate" /></KV>
              <KV label="CSDL đích">{db?.name || '-'}</KV>
              <KV label="Bảng đích"><span className="font-mono">{config.targetTable || '-'}</span></KV>
              <KV label="Lịch chạy">{config.schedule}</KV>
              <KV label="Khóa chính bảng đích"><span className="font-mono">{targetKeyText}</span></KV>
              {config.targetKey.mode === 'column' && (
                <KV label="Khi trùng khóa chính">
                  {DUPLICATE_RULE_LABEL[config.duplicateRule]}
                  {config.duplicateRule === 'latest' && config.duplicateTimeColumn ? ` (${columnLabel(config, config.duplicateTimeColumn)})` : ''}
                  {config.duplicateRule === 'source_priority' ? ` (${config.sourcePriority.map(id => findDataset(id)?.name).join(' → ')})` : ''}
                </KV>
              )}
              <KV label="Người tạo / Ngày tạo">{config.createdBy} · {config.createdAt}</KV>
              <div className="col-span-3"><KV label="Mô tả">{config.description || '-'}</KV></div>
            </div>
          </div>

          {/* Kết hợp: Join = bảng chính + các bảng nối; Union = ghép cột các nguồn */}
          <div className={TABLE_WRAP_CLS}>
            <div className="px-4 py-3 border-b border-[#E2E8F0] flex items-center justify-between gap-3">
              <span className="text-[14px] font-medium text-[#020817]">Kết hợp – {hasJoin ? 'Join' : unionLabel(config.unionAll)}</span>
              {hasJoin && <span className="text-[13px] text-[#64748B]">Bảng chính: <span className="text-[#020817] font-medium">{config.baseTable ? operandLabel(config.baseTable) : '-'}</span></span>}
            </div>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse collection-table text-[13px]">
                <thead className={TABLE_HEAD_BG}>
                  {hasJoin ? (
                    <tr className={TABLE_HEAD_ROW_CLS}>
                      <th className={`${TH} !text-center w-12`}>STT</th>
                      <th className={TH}>Kiểu nối</th>
                      <th className={TH}>Bảng nối</th>
                      <th className={`${TH} min-w-[360px]`}>Điều kiện ghép</th>
                      <th className={TH}>1 dòng khớp nhiều dòng</th>
                    </tr>
                  ) : (
                    <tr className={TABLE_HEAD_ROW_CLS}>
                      <th className={`${TH} !text-center w-12`}>STT</th>
                      <th className={TH}>Cột kết quả</th>
                      {config.sources.map(s => <th key={s.datasetId} className={TH}>{findDataset(s.datasetId)?.name}</th>)}
                    </tr>
                  )}
                </thead>
                <tbody>
                  {hasJoin && config.joins.map((j, i) => (
                    <tr key={j.id} className={ROW}>
                      <td className={`${TD} text-center`}>{i + 1}</td>
                      <td className={`${TD} whitespace-nowrap`}>{JOIN_TYPE_LABEL[j.type]}</td>
                      <td className={`${TD} whitespace-nowrap`}>{operandLabel(j.table)}</td>
                      <td className={`${TD} max-w-[520px]`}><TruncatedText text={describeOn(j) || '-'} className="font-mono" /></td>
                      <td className={`${TD} whitespace-nowrap`}>{ONE_TO_MANY_LABEL[j.oneToMany]}</td>
                    </tr>
                  ))}
                  {!hasJoin && config.unionColumns.map((u, i) => (
                    <tr key={u.name} className={ROW}>
                      <td className={`${TD} text-center`}>{i + 1}</td>
                      <td className={`${TD} font-mono whitespace-nowrap`}>{u.name}</td>
                      {config.sources.map(s => <td key={s.datasetId} className={`${TD} font-mono whitespace-nowrap ${u.refs[s.datasetId] ? '' : 'text-[#94A3B8]'}`}>{u.refs[s.datasetId] || 'Để trống'}</td>)}
                    </tr>
                  ))}
                  {(hasJoin ? config.joins.length : config.unionColumns.length) === 0 && (
                    <tr><td colSpan={hasJoin ? 5 : config.sources.length + 2} className="py-6 text-center text-[13px] text-[#64748B]">Chưa thiết lập</td></tr>
                  )}
                </tbody>
              </table>
            </div>
            {whereText && <div className="px-4 py-3 border-t border-[#E2E8F0] text-[13px]"><span className="text-[#64748B]">Điều kiện lọc: </span><span className="font-mono">{whereText}</span></div>}
          </div>

          {/* Nguồn dữ liệu */}
          <div className={TABLE_WRAP_CLS}>
            <div className="px-4 py-3 border-b border-[#E2E8F0] text-[14px] font-medium text-[#020817]">Nguồn dữ liệu ({config.sources.length})</div>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse collection-table text-[13px]">
                <thead className={TABLE_HEAD_BG}>
                  <tr className={TABLE_HEAD_ROW_CLS}>
                    <th className={`${TH} min-w-[200px]`}>Bộ dữ liệu</th>
                    <th className={TH}>Loại nguồn</th>
                    <th className={TH}>CSDL nguồn</th>
                    <th className={TH}>Khóa nguồn</th>
                    <th className={`${TH} !text-right`}>Bản ghi nguồn</th>
                    <th className={TH}>Lần chạy gần nhất</th>
                  </tr>
                </thead>
                <tbody>
                  {config.sources.map(s => {
                    const ds = findDataset(s.datasetId);
                    const last = lastRun?.perSource.find(p => p.datasetId === s.datasetId);
                    return (
                      <tr key={s.datasetId} className={ROW}>
                        <td className={`${TD} max-w-[260px]`}><TruncatedText text={ds?.name || ''} /></td>
                        <td className={TD}><Badge label={ds?.group || ''} /></td>
                        <td className={`${TD} max-w-[220px]`}><TruncatedText text={ds?.sourceDb || ''} /></td>
                        <td className={`${TD} font-mono whitespace-nowrap`}>{sourceKeyOf(s).join(', ') || '-'}</td>
                        <td className={`${TD} text-right tabular-nums`}>{fmt(ds?.records || 0)}</td>
                        <td className={`${TD} whitespace-nowrap`}>
                          {last ? (
                            <span className="tabular-nums">
                              <span className="text-[#16A34A]">+{fmt(last.inserted)}</span> · <span className="text-[#D97706]">~{fmt(last.updated)}</span> · <span className="text-[#DC2626]">−{fmt(last.deleted)}</span>
                              {last.unmatched ? <span className="text-[#64748B]"> · {fmt(last.unmatched)} không ghép được</span> : null}
                            </span>
                          ) : <span className="text-[#64748B]">-</span>}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {tab === 'rules' && (
        <div className="space-y-4">
          {config.sources.map(s => {
            const ds = findDataset(s.datasetId);
            const rules = [...(s.rules || [])].sort((a, b) => RULE_KINDS.findIndex(k => k.kind === a.kind) - RULE_KINDS.findIndex(k => k.kind === b.kind));
            return (
              <div key={s.datasetId} className={TABLE_WRAP_CLS}>
                <div className="px-4 py-3 border-b border-[#E2E8F0] flex items-center gap-2">
                  <span className="text-[14px] font-medium text-[#020817]">{ds?.name}</span>
                  <span className="text-[13px] text-[#64748B]">· {ds?.sourceDb}</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse collection-table text-[13px]">
                    <thead className={TABLE_HEAD_BG}>
                      <tr className={TABLE_HEAD_ROW_CLS}>
                        <th className={`${TH} w-[120px]`}>Nhóm</th>
                        <th className={`${TH} min-w-[260px]`}>Quy tắc</th>
                        <th className={TH}>Trường áp dụng</th>
                        <th className={`${TH} min-w-[300px]`}>Chi tiết</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rules.length === 0 && (
                        <tr><td colSpan={4} className="py-6 text-center text-[13px] text-[#64748B]">Không có quy tắc – dùng dữ liệu thu thập nguyên trạng</td></tr>
                      )}
                      {rules.map(r => (
                        <tr key={r.id} className={ROW}>
                          <td className={`${TD} whitespace-nowrap`}>{RULE_GROUP_LABEL[ruleGroupOf(r.kind)]}</td>
                          <td className={`${TD} max-w-[320px]`}><TruncatedText text={RULE_KINDS.find(k => k.kind === r.kind)?.title || ''} /></td>
                          <td className={`${TD} font-mono whitespace-nowrap`}>{r.field}</td>
                          <td className={`${TD} max-w-[420px]`}><TruncatedText text={describeRule(r)} /></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {tab === 'mapping' && (
        <div className="space-y-3">
          <p className="text-[13px] text-[#64748B]">Giá trị lấy từ kết quả bước Kết hợp. Theo độ ưu tiên: lấy cột đầu tiên có dữ liệu. Cột không cho phép trống mà kết quả trống thì dòng không được ghi.</p>
          <div className={TABLE_WRAP_CLS}>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse collection-table text-[13px]">
                <thead className={TABLE_HEAD_BG}>
                  <tr className={TABLE_HEAD_ROW_CLS}>
                    <th className={TH}>Cột đích</th>
                    <th className={TH}>Kiểu</th>
                    <th className={TH}>Cho phép trống</th>
                    <th className={TH}>Cách lấy</th>
                    <th className={`${TH} min-w-[360px]`}>Giá trị nguồn</th>
                  </tr>
                </thead>
                <tbody>
                  {targetCols.map(c => {
                    const m = config.mappings[c.name];
                    const how = c.isKey ? (config.targetKey.mode === 'auto' ? 'Tự động' : 'Theo cột') : mappingFilled(m) ? VALUE_MODE_LABEL[m.mode] : '-';
                    const val = c.isKey ? (config.targetKey.mode === 'auto' ? 'Hệ thống tự sinh' : columnLabel(config, config.targetKey.column)) : describeMapping(config, m);
                    return (
                      <tr key={c.name} className={ROW}>
                        <td className={`${TD} font-mono whitespace-nowrap`}>{c.name} {c.isKey && <Badge label="Khóa chính" variant="blue" />}</td>
                        <td className={`${TD} font-mono whitespace-nowrap text-[#64748B]`}>{c.type}</td>
                        <td className={TD}>{c.isKey || !c.nullable ? 'Không' : 'Có'}</td>
                        <td className={`${TD} whitespace-nowrap`}>{how}</td>
                        <td className={`${TD} max-w-[480px] ${val ? '' : 'text-[#94A3B8]'}`}><TruncatedText text={val || 'Chưa ánh xạ'} className="font-mono" /></td>
                      </tr>
                    );
                  })}
                  {TECH_COLUMNS.map(t => (
                    <tr key={t.name} className={`${ROW} bg-[#F8FAFC]`}>
                      <td className={`${TD} font-mono text-[#64748B] whitespace-nowrap`}>{t.name}</td>
                      <td colSpan={4} className={`${TD} text-[#64748B]`}>Hệ thống tự ghi – {t.note}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {tab === 'data' && (
        sample ? (
          <div className="space-y-4">
            <p className="text-[13px] text-[#64748B]">{sample.note}</p>
            <div className={TABLE_WRAP_CLS}>
              <div className="px-4 py-3 border-b border-[#E2E8F0] flex items-center justify-between gap-3">
                <span className="text-[14px] font-medium text-[#020817]">Bảng đích <span className="font-mono">{config.targetTable}</span> – lần chạy gần nhất</span>
                <span className="text-[12px] text-[#64748B]">Cột DIP_* do hệ thống ghi: căn cứ cập nhật khi nguồn thay đổi</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse collection-table text-[13px]">
                  <thead className={TABLE_HEAD_BG}>
                    <tr className={TABLE_HEAD_ROW_CLS}>
                      {sample.columns.map(c => (
                        <th key={c} className={`${TH} ${c.startsWith('DIP_') ? '!bg-[#E2E8F0]' : ''}`}>
                          <span className="inline-flex items-center gap-1">{keyColumns.includes(c) && <KeyRound className="w-3.5 h-3.5 text-blue-600" />}{c}</span>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {sample.rows.map((r, i) => (
                      <tr key={i} className={ROW}>
                        {sample.columns.map(c => (
                          <td key={c} className={`${TD} whitespace-nowrap ${c.startsWith('DIP_') ? 'bg-[#F8FAFC] font-mono text-[12px]' : ''} ${r[c] ? '' : 'text-[#94A3B8]'}`}>{r[c] || '(trống)'}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            {!!sample.unmatched?.length && (
              <div className={TABLE_WRAP_CLS}>
                <div className="px-4 py-3 border-b border-[#E2E8F0] text-[14px] font-medium text-[#020817]">Bản ghi nguồn không ghép được / không được chọn ({sample.unmatched.length})</div>
                <table className="w-full border-collapse collection-table text-[13px]">
                  <thead className={TABLE_HEAD_BG}>
                    <tr className={TABLE_HEAD_ROW_CLS}>
                      <th className={TH}>Nguồn</th>
                      <th className={TH}>Khóa nguồn</th>
                      <th className={TH}>Lý do</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sample.unmatched.map(u => (
                      <tr key={u.key} className={ROW}>
                        <td className={`${TD} whitespace-nowrap`}>{u.source}</td>
                        <td className={`${TD} font-mono whitespace-nowrap`}>{u.key}</td>
                        <td className={TD}>{u.reason}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ) : (
          <div className={`${CARD_CLS} text-center text-[13px] text-[#64748B]`}>Chưa có dữ liệu – cấu hình chưa chạy lần nào</div>
        )
      )}

      {/* Lịch sử chạy – theo tab Lịch sử của màn Xử lý dữ liệu: danh sách hoạt động + popup chi tiết */}
      {tab === 'history' && (
        <div className="space-y-4">
          <div className="flex items-center gap-1.5">
            <input aria-label="Tìm kiếm lịch sử chạy" className={SEARCH_INPUT_CLS} placeholder="Tìm kiếm theo mã yêu cầu, loại, người tạo, thời gian"
              value={historyKeyword} onChange={e => setHistoryKeyword(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') runHistory(); }} />
            <button type="button" aria-label="Tìm kiếm" onClick={runHistory} className={SEARCH_BTN_CLS}><Search className="w-5 h-5" /></button>
          </div>
          <div className={TABLE_WRAP_CLS}>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse collection-table text-[13px]">
                <thead className={TABLE_HEAD_BG}>
                  <tr className={TABLE_HEAD_ROW_CLS}>
                    <th className={`${TH} !text-center w-12`}>STT</th>
                    <th className={TH}>Mã yêu cầu</th>
                    <th className={TH}>Loại</th>
                    <th className={TH}>Người tạo</th>
                    <th className={TH}>Thời gian</th>
                    <th className={TH}>Thời gian xử lý</th>
                    <th className={TH}>Trạng thái</th>
                    <th className={`${TH} !text-center w-20`}>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {historyPageItems.length === 0 && (
                    <tr><td colSpan={8} className="py-10 text-center text-[13px] text-[#64748B]">{runs.length ? 'Không tìm thấy kết quả phù hợp' : 'Chưa có lịch sử hoạt động'}</td></tr>
                  )}
                  {historyPageItems.map((r, i) => (
                    <tr key={r.id} className={ROW}>
                      <td className={`${TD} text-center`}>{(historyPage - 1) * historyPageSize + i + 1}</td>
                      <td className={`${TD} font-mono whitespace-nowrap`}>{r.id}</td>
                      <td className={TD}><Badge label={RUN_ACTIVITY_LABEL[r.activity]} variant={RUN_ACTIVITY_VARIANT[r.activity]} /></td>
                      <td className={`${TD} whitespace-nowrap`}>{r.createdBy}</td>
                      <td className={`${TD} whitespace-nowrap`}>{r.createdAt}</td>
                      <td className={`${TD} whitespace-nowrap`}>{r.duration}</td>
                      <td className={TD}><Badge label={RUN_RESULT_LABEL[r.result]} variant={RUN_RESULT_VARIANT[r.result]} /></td>
                      <td className="px-3 py-1 text-center">
                        <RowIconAction label="Xem chi tiết" onClick={() => setRunDetail(r)}><Eye className="w-4 h-4" /></RowIconAction>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Pagination className="border-t border-[#E2E8F0]" currentPage={historyPage} totalItems={historyRows.length} pageSize={historyPageSize}
              onPageChange={setHistoryPage} onPageSizeChange={setHistoryPageSize} />
          </div>
        </div>
      )}

      {/* Xem chi tiết lịch sử hoạt động – 2 cột thông tin như màn Xử lý dữ liệu + số bản ghi theo nguồn */}
      <BaseModal
        isOpen={!!runDetail}
        onClose={() => setRunDetail(null)}
        title="Xem chi tiết lịch sử hoạt động"
        subtitle={runDetail ? `Mã yêu cầu ${runDetail.id} · ${RUN_ACTIVITY_LABEL[runDetail.activity]}` : ''}
        maxWidth="max-w-4xl"
        footer={<button type="button" onClick={() => setRunDetail(null)} className={BTN_OUTLINE}>Đóng</button>}
      >
        {runDetail && (
          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-x-6 gap-y-4">
              <KV label="Mã yêu cầu"><span className="font-mono">{runDetail.id}</span></KV>
              <KV label="Người tạo">{runDetail.createdBy}</KV>
              <KV label="Cấu hình">{config.name} ({config.code})</KV>
              <KV label="Thời gian khởi tạo">{runDetail.createdAt}</KV>
              <KV label="CSDL / Bảng đích">{db?.name} / <span className="font-mono">{config.targetTable}</span></KV>
              <KV label="Thời gian bắt đầu">{runDetail.startedAt}</KV>
              <KV label="Loại"><Badge label={RUN_ACTIVITY_LABEL[runDetail.activity]} variant={RUN_ACTIVITY_VARIANT[runDetail.activity]} /></KV>
              <KV label="Thời gian hoàn thành">{runDetail.endedAt}</KV>
              <KV label="Trạng thái"><Badge label={RUN_RESULT_LABEL[runDetail.result]} variant={RUN_RESULT_VARIANT[runDetail.result]} /></KV>
              <KV label="Thời gian xử lý">{runDetail.duration}</KV>
              <KV label="Mã lỗi"><span className={runDetail.errorCode ? 'text-[#DC2626]' : ''}>{runDetail.errorCode || 'Không có'}</span></KV>
              {runDetail.activity === 'clear'
                ? <KV label="Số bản ghi đã xóa">{fmt(runDetail.clearedRecords || 0)}</KV>
                : <KV label={hasJoin ? 'Bản ghi không ghép được' : 'Bản ghi trùng'}>{fmt(hasJoin ? sum(runDetail, 'unmatched') : runDetail.duplicates || 0)}</KV>}
            </div>
            {runDetail.activity !== 'clear' && (
              <div>
                <h4 className={SECTION_TITLE}>Số bản ghi theo nguồn</h4>
                <div className={TABLE_WRAP_CLS}>
                  <table className="w-full border-collapse collection-table text-[13px]">
                    <thead className={TABLE_HEAD_BG}>
                      <tr className={TABLE_HEAD_ROW_CLS}>
                        <th className={TH}>Nguồn</th>
                        <th className={`${TH} !text-right`}>Thêm</th>
                        <th className={`${TH} !text-right`}>Sửa</th>
                        <th className={`${TH} !text-right`}>Xóa</th>
                        {hasJoin && <th className={`${TH} !text-right`}>Không ghép được</th>}
                      </tr>
                    </thead>
                    <tbody>
                      {runDetail.perSource.map(p => (
                        <tr key={p.datasetId} className={ROW}>
                          <td className={`${TD} max-w-[280px]`}><TruncatedText text={`${findDataset(p.datasetId)?.name} · ${findDataset(p.datasetId)?.sourceDb}`} /></td>
                          <td className={`${TD} text-right tabular-nums`}>{fmt(p.inserted)}</td>
                          <td className={`${TD} text-right tabular-nums`}>{fmt(p.updated)}</td>
                          <td className={`${TD} text-right tabular-nums`}>{fmt(p.deleted)}</td>
                          {hasJoin && <td className={`${TD} text-right tabular-nums`}>{fmt(p.unmatched || 0)}</td>}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </BaseModal>
    </div>
  );
}
