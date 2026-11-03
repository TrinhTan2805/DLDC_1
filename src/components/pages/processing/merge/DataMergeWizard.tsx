import { Fragment, useEffect, useMemo, useState, type ReactNode } from 'react';
import { toast } from 'sonner';
import {
  Check, FileText, Database, Table2, KeyRound, ClipboardCheck, Sparkles, AlertTriangle, Info, Rows3, Search, Plus, Trash2, Eraser,
  ChevronUp, GitMerge, ArrowUp, X, SquarePen,
} from 'lucide-react';
import { BaseModal } from '../../../common/BaseModal';
import { ConfirmModal } from '../../../common/ConfirmModal';
import {
  Badge, TruncatedText, BTN_OUTLINE, BTN_PRIMARY, BTN_FOCUS, RowIconAction, INPUT_CLS, VIEW_FIELD_CLS, LABEL_CLS, REQUIRED_MARK, FIELD_LABEL, FIELD_VALUE,
  SEARCH_INPUT_CLS, SEARCH_BTN_CLS, FILTER_LABEL, SECTION_TITLE, TABLE_HEAD_BG, TABLE_HEAD_ROW_CLS, TABLE_WRAP_CLS, SearchableSelect, normalizeSearch,
} from '../../collection/collectionUi';
import { initialTargetDatabases } from '../mockTargetDatabases';
import {
  MergeConfig, MergeTargetColumn, MergeSourceRef, JoinStep, JoinType, CombineType, OnCondition, WhereCondition, UnionColumn, ColumnMapping, ValueMode,
  JoinOperator, KeyNormalize, OneToManyRule, FilterOperator, DuplicateRule, ResultColumn,
  mergeSourceDatasets, mergeTargetTables, findDataset, getSourceGroup, typeFamily, countRules, ruleIncomplete, sourceKeyOf,
  tableColumns, columnsBeforeJoin, resultColumns, columnLabel, splitRef, usedSources, describeOn, describeJoinStep, describeWhere, describeMapping,
  mappingFilled, isOptionalColumn, isSourceKeyColumn, hasUnionOrFull, operandLabel,
  RULE_GROUP_LABEL, TECH_COLUMNS, COMBINE_TITLE, COMBINE_DESC, JOIN_TYPE_LABEL, JOIN_TYPE_DESC, ONE_TO_MANY_LABEL, JOIN_OPERATORS, NORMALIZE_LABEL,
  FILTER_OPERATOR_LABEL, VALUE_MODE_LABEL, DUPLICATE_RULE_LABEL, filterNeedsValue, unionLabel,
} from './mockDataMerge';
import { MergeSourceRules } from './MergeSourceRules';

interface DataMergeWizardProps {
  isOpen: boolean;
  onClose: () => void;
  initial?: MergeConfig | null;
  onSave: (config: MergeConfig, activate: boolean) => void;
}

// Kết hợp đặt trước Bảng đích: cột gợi ý cho bảng tạo mới lấy từ kết quả kết hợp
const STEPS = [
  { s: 1, label: 'Thông tin chung', icon: FileText },
  { s: 2, label: 'Chọn nguồn', icon: Database },
  { s: 3, label: 'Xử lý nguồn', icon: Eraser },
  { s: 4, label: 'Kết hợp', icon: GitMerge },
  { s: 5, label: 'Bảng đích & ánh xạ', icon: Table2 },
  { s: 6, label: 'Xem lại & lưu', icon: ClipboardCheck },
];
const LAST_STEP = STEPS.length;

const TH = 'px-3 py-[13px] leading-4 text-left font-bold text-black whitespace-nowrap text-[13px]';
const TD = 'px-3 py-1 text-left text-black text-[13px]';
const ROW = 'h-12 bg-white border-b border-[#E0E0E0] hover:bg-[#F8FAFC] transition-colors';
const EDIT_ROW = 'bg-white border-b border-[#E0E0E0] last:border-b-0 align-top';
const CHECKBOX = 'w-4 h-4 accent-[#155DFC] cursor-pointer disabled:cursor-not-allowed';
const HINT = 'text-[12px] text-[#64748B]';
const ERROR_TEXT = 'mt-1 text-[12px] text-[#DC2626]';
const WARN_TEXT = 'mt-1 flex items-start gap-1 text-[12px] text-[#D97706]';
const POPOVER_Z = 'z-[1000000]'; // danh sách thả xuống nằm trên modal

// So khớp tên trường để gợi ý ánh xạ / khóa: bỏ dấu, gạch dưới, hoa thường
const simplify = (v: string) => normalizeSearch(v).replace(/[^a-z0-9]/g, '');
const SYNONYMS: Record<string, string[]> = {
  cccd: ['socccd', 'sodinhdanh', 'madinhdanh', 'masodinhdanh'],
  hoten: ['hotenday'],
  diachi: ['diachithuongtru'],
  noikcb: ['noidangkykcb'],
  ngaysinh: [], gioitinh: [], noisinh: [], dantoc: [], ngaydangky: [],
};
const isSimilar = (a: string, b: string) => {
  const x = simplify(a);
  const y = simplify(b);
  if (x === y) return true;
  return Object.entries(SYNONYMS).some(([k, list]) => {
    const all = [k, ...list];
    return all.includes(x) && all.includes(y);
  });
};

let seq = 0;
const newId = () => `j${Date.now().toString(36)}${seq++}`;
const emptyOn = (): OnCondition => ({ left: '', operator: '=', rightKind: 'column', right: '', value: '', normalize: 'trim' });
const emptyWhere = (): WhereCondition => ({ field: '', operator: '=', value: '' });
const emptyJoin = (table: string): JoinStep => ({ id: newId(), type: 'left', table, conditions: [emptyOn()], oneToMany: 'latest' });
const emptyMapping = (): ColumnMapping => ({ mode: 'column', columns: [], value: '' });
const conditionFilled = (x: OnCondition) => !!x.left && (x.rightKind === 'column' ? !!x.right : !!x.value.trim());
const joinComplete = (j: JoinStep) => !!j.table && j.conditions.length > 0 && j.conditions.every(conditionFilled);

const emptyConfig = (): MergeConfig => ({
  id: '', code: '', name: '', description: '', status: 'draft', targetDbId: '', targetTable: '',
  sources: [], combineType: 'join', baseTable: '', joins: [], unionAll: true, unionColumns: [], filters: [],
  mappings: {}, targetKey: { mode: 'auto', column: '' },
  duplicateRule: 'keep_old', duplicateTimeColumn: '', sourcePriority: [], dataCount: 0,
  schedule: 'Thủ công', createdBy: 'Nguyễn Văn A', createdAt: '',
});

// Union – tự khớp theo tên: lấy các trường của nguồn đầu, mỗi nguồn khác ghép trường cùng tên (mỗi trường dùng 1 lần)
const autoUnionFor = (c: MergeConfig): UnionColumn[] => {
  const [first, ...others] = c.sources.map(s => s.datasetId);
  if (!first) return [];
  const result: UnionColumn[] = [];
  (findDataset(first)?.fields || []).forEach(f => {
    if (result.some(u => isSimilar(u.name, f.name))) return;
    const refs: Record<string, string> = { [first]: f.name };
    others.forEach(id => {
      const hit = findDataset(id)?.fields.find(x => isSimilar(x.name, f.name) && !result.some(u => u.refs[id] === x.name));
      refs[id] = hit?.name || '';
    });
    result.push({ name: f.name, refs });
  });
  return result;
};

// Dựng sẵn phần kết hợp theo các nguồn đã chọn: Join = nguồn đầu làm bảng chính, mỗi nguồn còn lại 1 dòng nối
const ensureCombine = (c: MergeConfig): MergeConfig => {
  if (c.sources.length < 2) return c;
  const ids = c.sources.map(x => x.datasetId);
  if (c.combineType === 'union') return c.unionColumns.length ? c : { ...c, unionColumns: autoUnionFor(c) };
  const base = ids.includes(c.baseTable) ? c.baseTable : ids[0];
  const joins = c.joins.filter(j => ids.includes(j.table) && j.table !== base);
  ids.filter(id => id !== base && !joins.some(j => j.table === id)).forEach(id => joins.push(emptyJoin(id)));
  return { ...c, baseTable: base, joins };
};

// Bỏ mọi tham chiếu tới 1 bảng (khi bỏ chọn nguồn / đổi bảng nối)
const refersTo = (ref: string, table: string) => splitRef(ref).operand === table;
const dropConditionsOf = (j: JoinStep, table: string): JoinStep =>
  ({ ...j, conditions: j.conditions.filter(x => !refersTo(x.left, table) && !(x.rightKind === 'column' && refersTo(x.right, table))) });

// Bảng mới gợi ý từ kết quả kết hợp: cột ID tự động làm khóa + mỗi tên cột 1 lần, ánh xạ sẵn (trùng tên → theo độ ưu tiên)
const suggestTable = (c: MergeConfig) => {
  const cols: MergeTargetColumn[] = [{ name: 'ID', type: 'NUMBER(18)', isKey: true, nullable: false }];
  const mappings: Record<string, ColumnMapping> = {};
  resultColumns(c).forEach(x => {
    const name = splitRef(x.ref).field;
    const same = cols.find(k => isSimilar(k.name, name));
    if (same) {
      const m = mappings[same.name];
      if (m) mappings[same.name] = { ...m, mode: 'priority', columns: [...m.columns, x.ref] };
      return;
    }
    cols.push({ name, type: x.type, nullable: true });
    mappings[name] = { mode: 'column', columns: [x.ref], value: '' };
  });
  return { newTableColumns: cols, mappings, targetKey: { mode: 'auto' as const, column: '' } };
};

const KV = ({ label, children }: { label: string; children: ReactNode }) => (
  <div className="space-y-1">
    <div className={FIELD_LABEL}>{label}</div>
    <div className={FIELD_VALUE}>{children}</div>
  </div>
);

// Chọn nhiều cột có thứ tự: lấy cột đầu tiên có dữ liệu
function PriorityPicker({ value, options, onChange, label }: { value: string[]; options: ResultColumn[]; onChange: (v: string[]) => void; label: string }) {
  const labelOf = (ref: string) => options.find(o => o.ref === ref)?.label || ref;
  return (
    <div className="space-y-1.5">
      {value.map((ref, i) => (
        <div key={ref} className="flex items-center gap-1.5 h-9 pl-2 pr-1 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC]">
          <span className="w-5 h-5 shrink-0 rounded-full bg-[#EAF3FF] text-blue-600 text-[11px] font-semibold flex items-center justify-center">{i + 1}</span>
          <span className="flex-1 min-w-0 truncate font-mono text-[12px] text-[#020817]" title={labelOf(ref)}>{labelOf(ref)}</span>
          <RowIconAction label="Lên trên" onClick={() => { const a = [...value]; [a[i - 1], a[i]] = [a[i], a[i - 1]]; onChange(a); }} disabledReason={i === 0 ? 'Đang ở đầu' : undefined}>
            <ArrowUp className="w-4 h-4" />
          </RowIconAction>
          <RowIconAction label="Bỏ cột" onClick={() => onChange(value.filter(x => x !== ref))}><X className="w-4 h-4" /></RowIconAction>
        </div>
      ))}
      <SearchableSelect
        value=""
        onChange={v => v && onChange([...value, v])}
        options={options.filter(o => !value.includes(o.ref)).map(o => ({ value: o.ref, label: o.label }))}
        ariaLabel={label}
        placeholder={value.length ? '+ Thêm cột ưu tiên tiếp theo' : '-- Chọn các cột theo thứ tự ưu tiên --'}
        searchPlaceholder="Tìm theo Bảng.Cột"
        contentClassName={POPOVER_Z}
      />
    </div>
  );
}

export function DataMergeWizard({ isOpen, onClose, initial, onSave }: DataMergeWizardProps) {
  const [step, setStep] = useState(1);
  const [cfg, setCfg] = useState<MergeConfig>(emptyConfig());
  const [errors, setErrors] = useState<Record<string, string>>({});
  // Bước 2
  const [keyword, setKeyword] = useState('');
  const [appliedKeyword, setAppliedKeyword] = useState('');
  const [groupFilter, setGroupFilter] = useState('all');
  const [dbFilter, setDbFilter] = useState('all');
  // Bước 3
  const [ruleSource, setRuleSource] = useState('');
  // Bước 4: dòng bảng nối đang mở phần điều kiện (mặc định mở khi chưa nhập đủ)
  const [openJoins, setOpenJoins] = useState<Record<string, boolean>>({});
  // Bước 5
  const [tableMode, setTableMode] = useState<'existing' | 'new'>('existing');
  const [newTableName, setNewTableName] = useState('');
  // Xác nhận thao tác làm mất dữ liệu đã nhập
  const [pending, setPending] = useState<{ title: string; message: string; confirmText: string; onConfirm: () => void } | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    const base = initial ? JSON.parse(JSON.stringify(initial)) as MergeConfig : emptyConfig();
    const isNew = !!initial && !mergeTargetTables.some(t => t.dbId === initial.targetDbId && t.name === initial.targetTable);
    setCfg(base);
    setStep(1);
    setErrors({});
    setKeyword('');
    setAppliedKeyword('');
    setGroupFilter('all');
    setDbFilter('all');
    setRuleSource(base.sources[0]?.datasetId || '');
    setOpenJoins({});
    setTableMode(isNew ? 'new' : 'existing');
    setNewTableName(isNew ? initial!.targetTable : '');
    setPending(null);
  }, [isOpen, initial]);

  // Đã có dữ liệu: chỉ sửa Thông tin chung (trừ mã) và Xử lý nguồn; Chọn nguồn / Kết hợp / Bảng đích & ánh xạ chỉ xem
  const locked = !!initial && initial.dataCount > 0;
  const LOCKED_STEPS = [2, 4, 5];
  const update = (patch: Partial<MergeConfig>) => setCfg(prev => ({ ...prev, ...patch }));
  const updateSource = (id: string, patch: Partial<MergeSourceRef>) =>
    setCfg(prev => ({ ...prev, sources: prev.sources.map(s => s.datasetId === id ? { ...s, ...patch } : s) }));
  const selectedIds = cfg.sources.map(s => s.datasetId);
  const resultCols = useMemo(() => resultColumns(cfg), [cfg.combineType, cfg.baseTable, cfg.joins, cfg.unionColumns, cfg.sources]);
  const colOptions = resultCols.map(c => ({ value: c.ref, label: c.label }));

  // Cột đích: bảng có sẵn (tên / kiểu chỉ xem) hoặc bảng tạo mới (sửa được)
  const targetColumns: MergeTargetColumn[] = tableMode === 'existing'
    ? mergeTargetTables.find(t => t.dbId === cfg.targetDbId && t.name === cfg.targetTable)?.columns || []
    : cfg.newTableColumns || [];
  const keyCol = targetColumns.find(c => c.isKey);

  // --- Bước 2: chọn nguồn ---
  const toggleSource = (id: string) => {
    if (!selectedIds.includes(id)) { update({ sources: [...cfg.sources, { datasetId: id }] }); return; }
    // Bỏ nguồn: xóa mọi chỗ đang dùng nguồn đó ở bước Kết hợp / Ánh xạ
    setCfg(prev => {
      const isBase = prev.baseTable === id;
      const mappings = Object.fromEntries(Object.entries(prev.mappings).map(([k, m]) => [k, { ...m, columns: m.columns.filter(r => !refersTo(r, id)) }]));
      return {
        ...prev,
        sources: prev.sources.filter(s => s.datasetId !== id),
        baseTable: isBase ? '' : prev.baseTable,
        joins: isBase ? [] : prev.joins.filter(j => j.table !== id).map(j => dropConditionsOf(j, id)),
        unionColumns: prev.unionColumns.map(u => ({ ...u, refs: Object.fromEntries(Object.entries(u.refs).filter(([k]) => k !== id)) })),
        filters: prev.filters.filter(f => !refersTo(f.field, id)),
        mappings,
        targetKey: refersTo(prev.targetKey.column, id) ? { mode: 'auto', column: '' } : prev.targetKey,
        duplicateTimeColumn: refersTo(prev.duplicateTimeColumn, id) ? '' : prev.duplicateTimeColumn,
        sourcePriority: prev.sourcePriority.filter(x => x !== id),
      };
    });
  };
  const visibleDatasets = mergeSourceDatasets.filter(d => {
    const q = normalizeSearch(appliedKeyword);
    return (!q || normalizeSearch(`${d.name} ${d.sourceDb}`).includes(q))
      && (groupFilter === 'all' || d.group === groupFilter)
      && (dbFilter === 'all' || d.sourceDb === dbFilter);
  });
  const sourceDbOptions = Array.from(new Set(mergeSourceDatasets.map(d => d.sourceDb)));

  // --- Bước 4: kết hợp ---
  const ask = (title: string, message: string, confirmText: string, onConfirm: () => void) => setPending({ title, message, confirmText, onConfirm });
  const changeCombineType = (t: CombineType) => {
    if (t === cfg.combineType) return;
    const apply = () => setCfg(prev => ensureCombine({
      ...prev, combineType: t, baseTable: '', joins: [], unionColumns: [], filters: [],
      mappings: {}, targetKey: { mode: 'auto', column: '' }, duplicateTimeColumn: '',
      ...(tableMode === 'new' ? { newTableColumns: [] } : {}),
    }));
    const hasWork = cfg.joins.some(j => j.conditions.some(conditionFilled)) || cfg.unionColumns.length > 0 || cfg.filters.length > 0
      || Object.values(cfg.mappings).some(mappingFilled);
    if (hasWork) ask('Đổi loại kết hợp', 'Phần kết hợp, điều kiện lọc và ánh xạ đã nhập sẽ bị xóa. Bạn có muốn tiếp tục?', 'Đổi loại', apply);
    else apply();
  };
  const changeBase = (id: string) => {
    if (id === cfg.baseTable) return;
    const apply = () => setCfg(prev => ensureCombine({ ...prev, baseTable: id, joins: [], filters: [] }));
    if (cfg.joins.some(j => j.conditions.some(conditionFilled))) ask('Đổi bảng chính', 'Điều kiện ghép đã nhập sẽ bị xóa. Bạn có muốn tiếp tục?', 'Đổi bảng', apply);
    else apply();
  };
  const setJoin = (i: number, patch: Partial<JoinStep>) =>
    setCfg(prev => ({ ...prev, joins: prev.joins.map((j, k) => (k === i ? { ...j, ...patch } : j)) }));
  const changeJoinTable = (i: number, table: string) => setCfg(prev => {
    const old = prev.joins[i].table;
    return { ...prev, joins: prev.joins.map((j, k) => (k === i ? { ...j, table, conditions: [emptyOn()] } : k > i ? dropConditionsOf(j, old) : j)) };
  });
  const removeJoin = (i: number) => setCfg(prev => {
    const old = prev.joins[i].table;
    return { ...prev, joins: prev.joins.filter((_, k) => k !== i).map((j, k) => (k >= i ? dropConditionsOf(j, old) : j)) };
  });
  const unusedSources = selectedIds.filter(id => id !== cfg.baseTable && !cfg.joins.some(j => j.table === id));
  const addJoin = () => unusedSources[0] && setCfg(prev => ({ ...prev, joins: [...prev.joins, emptyJoin(unusedSources[0])] }));
  const setOn = (i: number, k: number, patch: Partial<OnCondition>) =>
    setJoin(i, { conditions: cfg.joins[i].conditions.map((c, n) => (n === k ? { ...c, ...patch } : c)) });
  const suggestConditions = () => {
    let filled = 0;
    const joins = cfg.joins.map((j, i) => {
      if (!j.table || j.conditions.some(c => c.rightKind === 'column' && c.left && c.right)) return j;
      const lf = columnsBeforeJoin(cfg, i).find(c => isSimilar(splitRef(c.ref).field, 'CCCD'));
      const rf = tableColumns(j.table).find(c => isSimilar(splitRef(c.ref).field, 'CCCD'));
      if (!lf || !rf) return j;
      filled++;
      return { ...j, conditions: [{ ...emptyOn(), left: lf.ref, right: rf.ref }, ...j.conditions.filter(c => c.left || c.right || c.value)] };
    });
    update({ joins });
    if (filled) toast.info(`Đã gợi ý điều kiện ghép cho ${filled} bảng nối theo trường định danh. Vui lòng kiểm tra lại.`);
    else toast.warning('Không tìm thấy cặp trường định danh phù hợp, vui lòng tự thiết lập điều kiện.');
  };
  const setUnionCol = (j: number, patch: Partial<UnionColumn>) =>
    update({ unionColumns: cfg.unionColumns.map((u, k) => (k === j ? { ...u, ...patch } : u)) });
  const setWhere = (k: number, patch: Partial<WhereCondition>) => update({ filters: cfg.filters.map((f, n) => (n === k ? { ...f, ...patch } : f)) });

  // --- Bước 5: bảng đích & ánh xạ ---
  const hasMapping = Object.values(cfg.mappings).some(mappingFilled) || !!cfg.targetKey.column;
  const confirmTargetChange = (apply: () => void) => {
    if (hasMapping) ask('Đổi bảng đích', 'Phần ánh xạ đã nhập sẽ bị xóa. Bạn có muốn tiếp tục?', 'Đổi bảng', apply);
    else apply();
  };
  const resetMapping = { mappings: {}, targetKey: { mode: 'auto' as const, column: '' }, duplicateTimeColumn: '' };
  const changeTableMode = (m: 'existing' | 'new') => confirmTargetChange(() => {
    setTableMode(m);
    setCfg(prev => ({
      ...prev, targetTable: '', ...resetMapping,
      ...(m === 'new' ? (prev.newTableColumns || []).length ? {} : suggestTable(prev) : {}),
    }));
  });
  const setNewCol = (i: number, patch: Partial<MergeTargetColumn>) => setCfg(prev => {
    const cols = prev.newTableColumns || [];
    const old = cols[i];
    const next = cols.map((c, k) => (k === i ? { ...c, ...patch } : patch.isKey ? { ...c, isKey: false } : c));
    const mappings = { ...prev.mappings };
    // Đổi tên cột → chuyển ánh xạ theo tên mới; cột thành khóa chính → lấy theo Khóa chính, bỏ ánh xạ thường
    if (patch.name !== undefined && old && old.name !== patch.name && mappings[old.name]) {
      mappings[patch.name] = mappings[old.name];
      delete mappings[old.name];
    }
    if (patch.isKey) delete mappings[next[i].name];
    return { ...prev, newTableColumns: next, mappings };
  });
  const removeNewCol = (i: number) => setCfg(prev => {
    const cols = prev.newTableColumns || [];
    const mappings = { ...prev.mappings };
    delete mappings[cols[i].name];
    return { ...prev, newTableColumns: cols.filter((_, k) => k !== i), mappings };
  });
  const mapOf = (col: string) => cfg.mappings[col] || emptyMapping();
  const setMap = (col: string, patch: Partial<ColumnMapping>) => update({ mappings: { ...cfg.mappings, [col]: { ...mapOf(col), ...patch } } });
  // Ánh xạ tự động chỉ khi hệ thống tạo cột cho bảng mới; bảng có sẵn và cột người dùng thêm thì ánh xạ thủ công
  const recreateColumns = () => {
    const apply = () => update(suggestTable(cfg));
    if ((cfg.newTableColumns || []).length) ask('Tạo lại cột', 'Danh sách cột và ánh xạ hiện tại sẽ được tạo lại theo kết quả kết hợp. Bạn có muốn tiếp tục?', 'Tạo lại', apply);
    else apply();
  };
  const keyWarnings = (): string[] => {
    if (cfg.targetKey.mode !== 'column' || !cfg.targetKey.column) return [];
    const w: string[] = [];
    if (!isSourceKeyColumn(cfg, cfg.targetKey.column)) w.push('Cột này không phải khóa nguồn: giá trị có thể thay đổi hoặc trùng, khi đổi thì khóa của dòng đổi theo.');
    if (hasUnionOrFull(cfg)) w.push('Cấu hình có Union / Full Join: giá trị khóa có thể trùng hoặc trống. Nên dùng Tự động.');
    if (isOptionalColumn(cfg, cfg.targetKey.column)) w.push('Cột có thể trống do kiểu nối: dòng trống khóa sẽ không được ghi.');
    return w;
  };

  // --- Kiểm tra từng bước ---
  const validate = (s: number, c: MergeConfig = cfg): boolean => {
    const e: Record<string, string> = {};
    if (s === 1) {
      if (!c.name.trim()) e.name = 'Tên cấu hình không được để trống';
      if (!c.code.trim()) e.code = 'Mã cấu hình không được để trống';
    }
    if (s === 2) {
      if (c.sources.length < 2) e.sources = 'Cần chọn tối thiểu 2 nguồn để hợp nhất';
      else {
        const noKey = c.sources.filter(x => !sourceKeyOf(x).length);
        if (noKey.length) e.sources = `Nguồn chưa có khóa, vui lòng chọn trường khóa: ${noKey.map(x => findDataset(x.datasetId)?.name).join(', ')}`;
      }
    }
    if (s === 3) {
      const bad = c.sources.filter(x => (x.rules || []).some(ruleIncomplete));
      if (bad.length) e.rules = `Quy tắc xử lý chưa nhập đầy đủ ở nguồn: ${bad.map(x => findDataset(x.datasetId)?.name).join(', ')}`;
    }
    if (s === 4) {
      if (c.combineType === 'join') {
        if (!c.baseTable) e.combine = 'Vui lòng chọn bảng chính';
        else if (!c.joins.length) e.combine = 'Cần ít nhất 1 bảng nối thêm';
        c.joins.forEach((j, i) => {
          if (!j.table) e[`join-${i}`] = 'Vui lòng chọn bảng';
          else if (!j.conditions.length) e[`join-${i}`] = 'Cần ít nhất 1 điều kiện ghép';
          else if (!j.conditions.every(conditionFilled)) e[`join-${i}`] = 'Vui lòng nhập đủ 2 vế của mỗi điều kiện ghép';
          else if (!j.conditions.some(x => x.rightKind === 'column' && x.operator === '=')) e[`join-${i}`] = 'Cần ít nhất 1 điều kiện cột = cột, tránh ghép chéo toàn bộ bản ghi';
        });
      } else {
        const names = c.unionColumns.map(u => u.name.trim().toUpperCase());
        if (!c.unionColumns.length) e.union = 'Cần ít nhất 1 cột ghép';
        else if (names.some(n => !n)) e.union = 'Vui lòng nhập tên cột kết quả';
        else if (new Set(names).size !== names.length) e.union = 'Tên cột kết quả bị trùng';
        else if (c.unionColumns.some(u => !Object.values(u.refs).some(Boolean))) e.union = 'Mỗi cột kết quả cần lấy từ ít nhất 1 nguồn';
      }
      if (c.filters.some(f => !f.field || (filterNeedsValue(f.operator) && !f.value.trim()))) e.where = 'Điều kiện lọc chưa đủ cột / giá trị';
      const unused = c.sources.filter(x => !usedSources(c).has(x.datasetId));
      if (!e.combine && !e.union && unused.length) e.combine = `Nguồn chưa tham gia kết hợp: ${unused.map(x => findDataset(x.datasetId)?.name).join(', ')}`;
    }
    if (s === 5) {
      if (!c.targetDbId) e.targetDb = 'Vui lòng chọn CSDL đích';
      if (tableMode === 'existing' && !c.targetTable) e.targetTable = 'Vui lòng chọn bảng đích';
      if (tableMode === 'new') {
        const cols = c.newTableColumns || [];
        if (!newTableName.trim()) e.targetTable = 'Tên bảng mới không được để trống';
        if (!cols.length) e.columns = 'Bảng mới cần ít nhất 1 cột';
        else if (cols.some(x => !x.name.trim() || !x.type.trim())) e.columns = 'Vui lòng nhập đủ tên cột và kiểu dữ liệu';
        else if (new Set(cols.map(x => x.name.trim().toUpperCase())).size !== cols.length) e.columns = 'Tên cột bị trùng';
        else if (cols.filter(x => x.isKey).length !== 1) e.columns = 'Bảng cần đúng 1 cột khóa chính';
      } else if (c.targetTable && !targetColumns.some(x => x.isKey)) e.columns = 'Bảng đích chưa có khóa chính, không thể dùng làm đích hợp nhất';
      if (keyCol && c.targetKey.mode === 'column' && !c.targetKey.column) e.key = 'Vui lòng chọn cột làm khóa chính';
      const missing = targetColumns.filter(t => !t.isKey && !t.nullable && t.name && !mappingFilled(c.mappings[t.name]));
      if (missing.length) e.mapping = `Cột không cho phép trống chưa được ánh xạ: ${missing.map(t => t.name).join(', ')}`;
      if (c.targetKey.mode === 'column' && c.duplicateRule === 'latest' && !c.duplicateTimeColumn) e.dup = 'Vui lòng chọn cột căn cứ thời gian';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const prepareFor = (target: number) => {
    if (target >= 4) setCfg(prev => ensureCombine(prev));
    if (target >= 5 && tableMode === 'new' && !(cfg.newTableColumns || []).length) setCfg(prev => ({ ...prev, ...suggestTable(prev) }));
    if (target >= 3 && !selectedIds.includes(ruleSource)) setRuleSource(cfg.sources[0]?.datasetId || '');
  };
  const goNext = () => {
    if (!validate(step)) return;
    if (step === 5 && tableMode === 'new') update({ targetTable: newTableName.trim().toUpperCase() });
    prepareFor(step + 1);
    setStep(step + 1);
  };
  const goTo = (target: number) => {
    if (target <= step) { setErrors({}); setStep(target); return; }
    for (let s = step; s < target; s++) {
      if (!validate(s)) { setStep(s); return; }
      prepareFor(s + 1);
    }
    setStep(target);
  };
  const save = (activate: boolean) => {
    if (!validate(1)) { setStep(1); return; }
    if (activate) {
      for (let s = 2; s < LAST_STEP; s++) if (!validate(s)) { setStep(s); toast.warning('Cấu hình chưa đầy đủ, chưa thể kích hoạt'); return; }
    }
    const targetTable = tableMode === 'new' ? newTableName.trim().toUpperCase() : cfg.targetTable;
    onSave({ ...cfg, targetTable, newTableColumns: tableMode === 'new' ? cfg.newTableColumns : undefined }, activate);
  };

  const targetDb = initialTargetDatabases.find(d => d.id === cfg.targetDbId);
  const errorBox = (key: string) => errors[key] && <p className={ERROR_TEXT}>{errors[key]}</p>;
  const ruleDs = findDataset(ruleSource);
  const keyText = cfg.targetKey.mode === 'auto' ? 'Tự động' : columnLabel(cfg, cfg.targetKey.column) || '-';
  const whereText = describeWhere(cfg);

  const footer = (
    <div className="flex items-center justify-between w-full gap-3">
      <button type="button" onClick={onClose} className={BTN_OUTLINE}>Hủy</button>
      <div className="flex items-center gap-3">
        {step > 1 && <button type="button" onClick={() => { setErrors({}); setStep(step - 1); }} className={BTN_OUTLINE}>Quay lại</button>}
        {step > 1 && <button type="button" onClick={() => save(false)} className={BTN_OUTLINE}>Lưu nháp</button>}
        {step < LAST_STEP && <button type="button" onClick={goNext} className={BTN_PRIMARY}>Tiếp theo</button>}
        {step === LAST_STEP && <button type="button" onClick={() => save(true)} className={BTN_PRIMARY}>Lưu và kích hoạt</button>}
      </div>
    </div>
  );

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title={initial ? 'Chỉnh sửa cấu hình hợp nhất' : 'Thêm mới cấu hình hợp nhất'}
      subtitle="Gộp nhiều bộ dữ liệu vào cùng một bảng CSDL đích"
      maxWidth="max-w-[1200px]"
      className="h-[90vh]"
      customHeaderIcon={
        <div className="w-10 h-10 shrink-0 rounded-lg bg-[#EAF3FF] flex items-center justify-center text-blue-600 mr-3">
          <Rows3 className="w-5 h-5" />
        </div>
      }
      footer={footer}
    >
      <div className="flex flex-col gap-6">
        {/* Thanh bước */}
        <div className="flex items-center justify-between w-full">
          {STEPS.map((item, index) => {
            const isActive = step === item.s;
            const isCompleted = step > item.s;
            return (
              <div key={item.s} className="flex items-center flex-1 last:flex-none">
                <button type="button" onClick={() => goTo(item.s)} className="flex items-center gap-2 group cursor-pointer rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-blue-600">
                  <div className={`w-8 h-8 shrink-0 rounded-full flex items-center justify-center border-2 transition-colors ${isActive ? 'border-[#155DFC] bg-[#155DFC] text-white' : isCompleted ? 'border-[#155DFC] bg-white text-[#155DFC]' : 'border-[#E2E8F0] bg-white text-[#94A3B8] group-hover:text-[#155DFC]'}`}>
                    {isCompleted ? <Check className="w-4 h-4" /> : <item.icon className="w-4 h-4" />}
                  </div>
                  <div className="flex-col text-left hidden sm:flex">
                    <span className={`text-[12px] ${isActive || isCompleted ? 'text-[#155DFC]' : 'text-[#64748B]'}`}>Bước {item.s}</span>
                    <span className={`text-[13px] font-medium whitespace-nowrap ${isActive || isCompleted ? 'text-[#020817]' : 'text-[#64748B]'}`}>{item.label}</span>
                  </div>
                </button>
                {index < STEPS.length - 1 && (
                  <div className="flex-1 mx-3 flex items-center">
                    <div className={`h-0.5 w-full rounded-full transition-colors ${isCompleted ? 'bg-[#155DFC]' : 'bg-[#E2E8F0]'}`} />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* ① Thông tin chung */}
        {step === 1 && (
          <div className="grid grid-cols-2 gap-x-6 gap-y-4">
            <div>
              <label className={LABEL_CLS}>Tên cấu hình <span className={REQUIRED_MARK}>*</span></label>
              <input className={`${INPUT_CLS} ${errors.name ? '!border-[#DC2626]' : ''}`} placeholder="Nhập tên cấu hình hợp nhất"
                value={cfg.name} onChange={e => update({ name: e.target.value })} />
              {errorBox('name')}
            </div>
            <div>
              <label className={LABEL_CLS}>Mã cấu hình <span className={REQUIRED_MARK}>*</span></label>
              <input className={`${INPUT_CLS} ${errors.code ? '!border-[#DC2626]' : ''}`} placeholder="VD: HN_CONG_DAN" disabled={locked}
                value={cfg.code} onChange={e => update({ code: e.target.value.toUpperCase().replace(/\s+/g, '_') })} />
              {errorBox('code')}
            </div>
            <div className="col-span-2">
              <label className={LABEL_CLS}>Mô tả</label>
              <textarea rows={3} className={`${INPUT_CLS} !h-auto py-2`} placeholder="Nhập mô tả mục đích hợp nhất"
                value={cfg.description} onChange={e => update({ description: e.target.value })} />
            </div>
          </div>
        )}

        {locked && LOCKED_STEPS.includes(step) && (
          <p className="flex items-start gap-2 p-3 rounded-lg border border-[#FDE68A] bg-[#FFFBEB] text-[13px] text-[#92400E]">
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>Cấu hình đã ghi <strong className="font-medium">{initial!.dataCount.toLocaleString('vi-VN')}</strong> bản ghi vào bảng đích nên bước này chỉ xem. Muốn chọn lại nguồn, kết hợp, bảng đích hoặc ánh xạ, vui lòng <strong className="font-medium">Xóa dữ liệu</strong> trước.</span>
          </p>
        )}
        <fieldset disabled={locked && LOCKED_STEPS.includes(step)} className="min-w-0">
        {/* ② Chọn nguồn */}
        {step === 2 && (
          <div className="space-y-4">
            <div className="flex items-center gap-1.5">
              <input aria-label="Tìm kiếm bộ dữ liệu" className={SEARCH_INPUT_CLS} placeholder="Tìm kiếm theo tên bộ dữ liệu, CSDL nguồn"
                value={keyword} onChange={e => setKeyword(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') setAppliedKeyword(keyword); }} />
              <button type="button" aria-label="Tìm kiếm" className={SEARCH_BTN_CLS} onClick={() => setAppliedKeyword(keyword)}>
                <Search className="w-5 h-5" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className={FILTER_LABEL}>Loại nguồn</label>
                <select aria-label="Loại nguồn" className={INPUT_CLS} value={groupFilter} onChange={e => setGroupFilter(e.target.value)}>
                  <option value="all">Tất cả loại nguồn</option>
                  <option value="Trong ngành">Trong ngành</option>
                  <option value="Ngoài ngành">Ngoài ngành</option>
                </select>
              </div>
              <div>
                <label className={FILTER_LABEL}>CSDL nguồn</label>
                <select aria-label="CSDL nguồn" className={INPUT_CLS} value={dbFilter} onChange={e => setDbFilter(e.target.value)}>
                  <option value="all">Tất cả CSDL nguồn</option>
                  {sourceDbOptions.map(o => <option key={o} value={o}>{o}</option>)}
                </select>
              </div>
            </div>

            <div className={TABLE_WRAP_CLS}>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse collection-table text-[13px]">
                  <thead className={TABLE_HEAD_BG}>
                    <tr className={TABLE_HEAD_ROW_CLS}>
                      <th className={`${TH} text-center w-12`}>Chọn</th>
                      <th className={`${TH} min-w-[200px]`}>Bộ dữ liệu</th>
                      <th className={TH}>Loại nguồn</th>
                      <th className={TH}>CSDL nguồn</th>
                      <th className={TH}>Khóa nguồn</th>
                      <th className={`${TH} !text-right`}>Bản ghi</th>
                      <th className={TH}>Thu thập gần nhất</th>
                    </tr>
                  </thead>
                  <tbody>
                    {visibleDatasets.length === 0 && (
                      <tr><td colSpan={7} className="py-8 text-center text-[13px] text-[#64748B]">Không tìm thấy kết quả phù hợp</td></tr>
                    )}
                    {visibleDatasets.map(d => {
                      const checked = selectedIds.includes(d.id);
                      const ref = cfg.sources.find(s => s.datasetId === d.id);
                      return (
                        <tr key={d.id} className={ROW}>
                          <td className={`${TD} text-center`}>
                            <input type="checkbox" aria-label={`Chọn ${d.name}`} className={CHECKBOX} checked={checked} onChange={() => toggleSource(d.id)} />
                          </td>
                          <td className={`${TD} max-w-[280px] leading-[18px]`}>
                            <TruncatedText text={d.name} />
                            {d.directTarget && (
                              <span className="flex items-center gap-1 text-[12px] text-[#D97706]">
                                <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                                <TruncatedText text={`Đang ghi trực tiếp vào ${d.directTarget}`} />
                              </span>
                            )}
                          </td>
                          <td className={TD}><Badge label={d.group} /></td>
                          <td className={`${TD} max-w-[220px]`}><TruncatedText text={d.sourceDb} /></td>
                          <td className={`${TD} whitespace-nowrap`}>
                            {d.keyFields?.length ? (
                              <span className="inline-flex items-center gap-1 font-mono"><KeyRound className="w-3.5 h-3.5 text-[#64748B]" />{d.keyFields.join(', ')}</span>
                            ) : checked ? (
                              <select aria-label={`Trường khóa ${d.name}`} className={`${INPUT_CLS} !w-[190px] ${ref?.keyFields?.length ? '' : '!border-[#D97706]'}`}
                                value={ref?.keyFields?.[0] || ''} onChange={e => updateSource(d.id, { keyFields: [e.target.value] })}>
                                <option value="" disabled hidden>-- Chọn trường khóa --</option>
                                {d.fields.map(f => <option key={f.name} value={f.name}>{f.name}</option>)}
                              </select>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-[12px] text-[#D97706]"><AlertTriangle className="w-3.5 h-3.5" /> Chưa có khóa</span>
                            )}
                          </td>
                          <td className={`${TD} text-right tabular-nums whitespace-nowrap`}>{d.records.toLocaleString('vi-VN')}</td>
                          <td className={`${TD} whitespace-nowrap`}>
                            {d.processedAt || <span className="text-[#64748B]">Chưa có dữ liệu thu thập</span>}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className={HINT}>
                Đã chọn <strong className="text-[#020817]">{cfg.sources.length}</strong> nguồn
                {cfg.sources.length > 0 && <> · Loại nguồn: <strong className="text-[#020817]">{getSourceGroup(cfg.sources)}</strong></>}
              </span>
              {errorBox('sources')}
            </div>
          </div>
        )}

        {/* ③ Xử lý nguồn */}
        {step === 3 && (
          <div className="space-y-4">
            <p className={`flex items-start gap-2 ${HINT}`}>
              <Info className="w-4 h-4 shrink-0 mt-0.5" />
              <span>Hợp nhất lấy <strong className="text-[#020817] font-medium">dữ liệu thu thập gốc</strong> của từng nguồn và xử lý theo quy tắc khai báo tại đây, trước khi kết hợp.</span>
            </p>
            <div role="tablist" aria-label="Nguồn cần xử lý" className="flex items-center gap-2 flex-wrap">
              {cfg.sources.map(s => {
                const c = countRules(s.rules);
                const total = c.clean + c.standardize + c.transform;
                const active = ruleSource === s.datasetId;
                return (
                  <button key={s.datasetId} type="button" role="tab" aria-selected={active} onClick={() => setRuleSource(s.datasetId)}
                    className={`h-10 px-3 inline-flex items-center gap-2 rounded-lg border text-[13px] font-medium transition-colors ${BTN_FOCUS} ${active ? 'bg-[#EAF3FF] border-[#BFDBFE] text-blue-600' : 'bg-white border-[#CBD5E1] text-[#334155] hover:bg-[#F8FAFC]'}`}>
                    {findDataset(s.datasetId)?.name}
                    <span className={`min-w-6 h-5 px-1.5 rounded-full text-[12px] inline-flex items-center justify-center ${total ? 'bg-blue-600 text-white' : 'bg-[#F1F5F9] text-[#64748B]'}`}>{total}</span>
                  </button>
                );
              })}
            </div>
            {errorBox('rules')}
            {ruleDs && (
              <MergeSourceRules
                dataset={ruleDs}
                rules={cfg.sources.find(s => s.datasetId === ruleSource)?.rules || []}
                onChange={rules => updateSource(ruleSource, { rules })}
                showErrors={!!errors.rules}
              />
            )}
          </div>
        )}

        {/* ④ Kết hợp – mỗi cấu hình 1 loại: Join (bảng chính + các bảng nối) hoặc Union (ghép cột các nguồn) */}
        {step === 4 && (
          <div className="space-y-5">
            <div>
              <div className={LABEL_CLS}>Loại kết hợp <span className={REQUIRED_MARK}>*</span></div>
              <div role="radiogroup" aria-label="Loại kết hợp" className="flex items-center gap-8 h-10">
                {(['join', 'union'] as CombineType[]).map(t => (
                  <label key={t} className="inline-flex items-center gap-2 text-[13px] text-[#020817] cursor-pointer">
                    <input type="radio" name="combine-type" className={CHECKBOX} checked={cfg.combineType === t} onChange={() => changeCombineType(t)} />
                    <span className="font-medium">{COMBINE_TITLE[t]}</span>
                    <span className="text-[#64748B]">· {COMBINE_DESC[t]}</span>
                  </label>
                ))}
              </div>
            </div>

            {cfg.combineType === 'join' && (
              <>
                <div className="grid grid-cols-2 gap-x-6">
                  <div>
                    <label className={LABEL_CLS}>Bảng chính <span className={REQUIRED_MARK}>*</span></label>
                    <select aria-label="Bảng chính" className={INPUT_CLS} value={cfg.baseTable} onChange={e => changeBase(e.target.value)}>
                      <option value="" disabled hidden>-- Chọn bảng --</option>
                      {cfg.sources.map(s => <option key={s.datasetId} value={s.datasetId}>{findDataset(s.datasetId)?.name}</option>)}
                    </select>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className={LABEL_CLS}>Bảng nối thêm <span className={REQUIRED_MARK}>*</span></div>
                    <button type="button" onClick={suggestConditions} className={`${BTN_OUTLINE} !h-8`}>
                      <Sparkles className="w-4 h-4" /> Gợi ý điều kiện
                    </button>
                  </div>
                  <div className={TABLE_WRAP_CLS}>
                    <table className="w-full border-collapse collection-table text-[13px]">
                      <thead className={TABLE_HEAD_BG}>
                        <tr className={TABLE_HEAD_ROW_CLS}>
                          <th className={`${TH} w-14 !text-center`}>STT</th>
                          <th className={`${TH} w-[150px]`}>Kiểu nối</th>
                          <th className={`${TH} w-[240px]`}>Bảng</th>
                          <th className={TH}>Điều kiện ghép</th>
                          <th className={`${TH} w-[96px] !text-center`}>Thao tác</th>
                        </tr>
                      </thead>
                      <tbody>
                        {cfg.joins.length === 0 && <tr><td colSpan={5} className="py-6 text-center text-[13px] text-[#64748B]">Chưa có bảng nối</td></tr>}
                        {cfg.joins.map((j, i) => {
                          const open = !!errors[`join-${i}`] || (openJoins[j.id] ?? !joinComplete(j));
                          const before = columnsBeforeJoin(cfg, i);
                          const own = j.table ? tableColumns(j.table) : [];
                          const typeOf = (ref: string) => [...before, ...own].find(c => c.ref === ref)?.type;
                          const summary = describeOn({ ...j, conditions: j.conditions.filter(conditionFilled) });
                          return (
                            <Fragment key={j.id}>
                              <tr className={`${EDIT_ROW} ${open ? '!border-b-0' : ''}`}>
                                <td className={`${TD} py-2 leading-10 text-center`}>{i + 1}</td>
                                <td className={`${TD} py-2`}>
                                  <select aria-label={`Kiểu nối, bảng nối ${i + 1}`} className={INPUT_CLS} value={j.type} onChange={e => setJoin(i, { type: e.target.value as JoinType })}>
                                    {(Object.keys(JOIN_TYPE_LABEL) as JoinType[]).map(k => <option key={k} value={k} title={JOIN_TYPE_DESC[k]}>{JOIN_TYPE_LABEL[k]}</option>)}
                                  </select>
                                </td>
                                <td className={`${TD} py-2`}>
                                  <select aria-label={`Bảng nối ${i + 1}`} className={INPUT_CLS} value={j.table} onChange={e => changeJoinTable(i, e.target.value)}>
                                    <option value="" disabled hidden>-- Chọn bảng --</option>
                                    {selectedIds.filter(id => id === j.table || unusedSources.includes(id)).map(id => <option key={id} value={id}>{findDataset(id)?.name}</option>)}
                                  </select>
                                </td>
                                <td className={`${TD} py-2 max-w-0`}>
                                  <div className="min-h-10 flex items-center">
                                    {summary ? <TruncatedText text={summary} className="font-mono text-[12px]" /> : <span className="text-[#D97706]">Chưa có điều kiện ghép</span>}
                                  </div>
                                  {errorBox(`join-${i}`)}
                                </td>
                                <td className={`${TD} py-2 text-center whitespace-nowrap`}>
                                  <div className="inline-flex items-center gap-1 h-10">
                                    <RowIconAction label={open ? 'Thu gọn' : 'Sửa điều kiện ghép'} onClick={() => setOpenJoins(prev => ({ ...prev, [j.id]: !open }))}>
                                      {open ? <ChevronUp className="w-4 h-4" /> : <SquarePen className="w-4 h-4" />}
                                    </RowIconAction>
                                    <RowIconAction label="Xóa bảng nối" onClick={() => removeJoin(i)}><Trash2 className="w-4 h-4" /></RowIconAction>
                                  </div>
                                </td>
                              </tr>
                              {open && (
                                <tr className="border-b border-[#E0E0E0] last:border-b-0">
                                  <td />
                                  <td colSpan={4} className="pb-4 pr-3">
                                    <div className="rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] p-3 space-y-3">
                                      <table className="w-full border-collapse text-[13px]">
                                        <thead>
                                          <tr className="text-left text-[12px] text-[#64748B]">
                                            <th className="pb-1 pr-2 font-medium">Cột</th>
                                            <th className="pb-1 pr-2 font-medium w-[90px]">Điều kiện</th>
                                            <th className="pb-1 pr-2 font-medium w-[150px]">So với</th>
                                            <th className="pb-1 pr-2 font-medium">Cột {operandLabel(j.table)} / Giá trị</th>
                                            <th className="pb-1 pr-2 font-medium w-[240px]">Chuẩn hóa khi so sánh</th>
                                            <th className="pb-1 w-10" />
                                          </tr>
                                        </thead>
                                        <tbody>
                                          {j.conditions.map((c, k) => {
                                            const lt = typeOf(c.left);
                                            const rt = c.rightKind === 'column' ? typeOf(c.right) : undefined;
                                            const mismatch = lt && rt && typeFamily(lt) !== typeFamily(rt);
                                            return (
                                              <tr key={k} className="align-top">
                                                <td className="py-1 pr-2">
                                                  <select aria-label={`Cột, điều kiện ${k + 1} bảng nối ${i + 1}`} className={INPUT_CLS} value={c.left} onChange={e => setOn(i, k, { left: e.target.value })}>
                                                    <option value="" disabled hidden>-- Chọn cột --</option>
                                                    {(c.rightKind === 'column' ? before : [...before, ...own]).map(o => <option key={o.ref} value={o.ref}>{o.label} ({o.type})</option>)}
                                                  </select>
                                                </td>
                                                <td className="py-1 pr-2">
                                                  <select aria-label={`Điều kiện ${k + 1} bảng nối ${i + 1}`} className={`${INPUT_CLS} font-mono`} value={c.operator} onChange={e => setOn(i, k, { operator: e.target.value as JoinOperator })}>
                                                    {JOIN_OPERATORS.map(o => <option key={o} value={o}>{o}</option>)}
                                                  </select>
                                                </td>
                                                <td className="py-1 pr-2">
                                                  <select aria-label={`So với, điều kiện ${k + 1} bảng nối ${i + 1}`} className={INPUT_CLS} value={c.rightKind}
                                                    onChange={e => setOn(i, k, { rightKind: e.target.value as 'column' | 'value', right: '', value: '', normalize: e.target.value === 'value' ? 'none' : c.normalize })}>
                                                    <option value="column">Cột bảng nối</option>
                                                    <option value="value">Giá trị</option>
                                                  </select>
                                                </td>
                                                <td className="py-1 pr-2">
                                                  {c.rightKind === 'column' ? (
                                                    <select aria-label={`Cột bảng nối, điều kiện ${k + 1} bảng nối ${i + 1}`} className={INPUT_CLS} value={c.right} onChange={e => setOn(i, k, { right: e.target.value })}>
                                                      <option value="" disabled hidden>-- Chọn cột --</option>
                                                      {own.map(o => <option key={o.ref} value={o.ref}>{o.label} ({o.type})</option>)}
                                                    </select>
                                                  ) : (
                                                    <input aria-label={`Giá trị, điều kiện ${k + 1} bảng nối ${i + 1}`} className={INPUT_CLS} placeholder="VD: 1" value={c.value}
                                                      onChange={e => setOn(i, k, { value: e.target.value })} />
                                                  )}
                                                  {mismatch && <p className={WARN_TEXT}><AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" /> Khác kiểu dữ liệu</p>}
                                                </td>
                                                <td className="py-1 pr-2">
                                                  <select aria-label={`Chuẩn hóa, điều kiện ${k + 1} bảng nối ${i + 1}`} className={INPUT_CLS} value={c.normalize} disabled={c.rightKind === 'value'}
                                                    onChange={e => setOn(i, k, { normalize: e.target.value as KeyNormalize })}>
                                                    {(Object.keys(NORMALIZE_LABEL) as KeyNormalize[]).map(n => <option key={n} value={n}>{NORMALIZE_LABEL[n]}</option>)}
                                                  </select>
                                                </td>
                                                <td className="py-1 text-center">
                                                  <div className="h-10 inline-flex items-center">
                                                    <RowIconAction label="Xóa điều kiện" onClick={() => setJoin(i, { conditions: j.conditions.filter((_, n) => n !== k) })}><Trash2 className="w-4 h-4" /></RowIconAction>
                                                  </div>
                                                </td>
                                              </tr>
                                            );
                                          })}
                                        </tbody>
                                      </table>
                                      <div className="flex items-center justify-between gap-4 flex-wrap">
                                        <button type="button" className={`${BTN_OUTLINE} !h-8`} onClick={() => setJoin(i, { conditions: [...j.conditions, emptyOn()] })}>
                                          <Plus className="w-4 h-4" /> Thêm điều kiện
                                        </button>
                                        <label className="inline-flex items-center gap-2 text-[13px] text-[#334155]">
                                          Khi 1 dòng khớp nhiều dòng
                                          <select aria-label={`Xử lý 1-nhiều, bảng nối ${i + 1}`} className={`${INPUT_CLS} !w-[300px]`} value={j.oneToMany}
                                            onChange={e => setJoin(i, { oneToMany: e.target.value as OneToManyRule })}>
                                            {(Object.keys(ONE_TO_MANY_LABEL) as OneToManyRule[]).map(k => <option key={k} value={k}>{ONE_TO_MANY_LABEL[k]}</option>)}
                                          </select>
                                        </label>
                                      </div>
                                      {j.type !== 'inner' && <p className={HINT}>Điều kiện trên cột của {operandLabel(j.table)} (VD trạng thái = 1) nên đặt ở đây thay vì ở điều kiện lọc.</p>}
                                    </div>
                                  </td>
                                </tr>
                              )}
                            </Fragment>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                  <button type="button" onClick={addJoin} className={`${BTN_OUTLINE} mt-3`} disabled={!unusedSources.length || !cfg.baseTable}>
                    <Plus className="w-4 h-4" /> Thêm bảng nối
                  </button>
                </div>
              </>
            )}

            {cfg.combineType === 'union' && (
              <div>
                <div className="flex items-end justify-between gap-4 mb-3">
                  <div className="w-[340px]">
                    <label className={LABEL_CLS}>Dòng trùng hoàn toàn</label>
                    <select aria-label="Dòng trùng hoàn toàn" className={INPUT_CLS} value={cfg.unionAll ? 'all' : 'distinct'} onChange={e => update({ unionAll: e.target.value === 'all' })}>
                      <option value="all">Giữ tất cả ({unionLabel(true)})</option>
                      <option value="distinct">Chỉ giữ 1 dòng ({unionLabel(false)})</option>
                    </select>
                  </div>
                  <button type="button" className={`${BTN_OUTLINE} !h-8`} onClick={() => update({ unionColumns: autoUnionFor(cfg) })}>
                    <Sparkles className="w-4 h-4" /> Tự khớp theo tên
                  </button>
                </div>
                <div className={`${LABEL_CLS} mb-2`}>Ghép cột <span className={REQUIRED_MARK}>*</span></div>
                <div className={TABLE_WRAP_CLS}>
                  <div className="overflow-x-auto max-h-[380px] overflow-y-auto custom-scrollbar">
                    <table className="w-full border-collapse collection-table text-[13px]">
                      <thead className={`${TABLE_HEAD_BG} sticky top-0 z-[1]`}>
                        <tr className={TABLE_HEAD_ROW_CLS}>
                          <th className={`${TH} w-14 !text-center`}>STT</th>
                          <th className={`${TH} min-w-[200px]`}>Cột kết quả</th>
                          {cfg.sources.map(s => <th key={s.datasetId} className={`${TH} min-w-[180px]`}>{findDataset(s.datasetId)?.name}</th>)}
                          <th className={`${TH} w-[80px] !text-center`}>Thao tác</th>
                        </tr>
                      </thead>
                      <tbody>
                        {cfg.unionColumns.length === 0 && <tr><td colSpan={cfg.sources.length + 3} className="py-6 text-center text-[13px] text-[#64748B]">Chưa có cột ghép</td></tr>}
                        {cfg.unionColumns.map((u, j) => (
                          <tr key={j} className={EDIT_ROW}>
                            <td className={`${TD} py-2 leading-10 text-center`}>{j + 1}</td>
                            <td className={`${TD} py-2`}>
                              <input aria-label={`Tên cột kết quả ${j + 1}`} className={`${INPUT_CLS} font-mono`} placeholder="VD: HO_TEN" value={u.name}
                                onChange={e => setUnionCol(j, { name: e.target.value.toUpperCase().replace(/\s+/g, '_') })} />
                            </td>
                            {cfg.sources.map(s => (
                              <td key={s.datasetId} className={`${TD} py-2`}>
                                <select aria-label={`Cột ${findDataset(s.datasetId)?.name}, dòng ${j + 1}`} className={INPUT_CLS} value={u.refs[s.datasetId] || ''}
                                  onChange={e => setUnionCol(j, { refs: { ...u.refs, [s.datasetId]: e.target.value } })}>
                                  <option value="">-- Để trống --</option>
                                  {(findDataset(s.datasetId)?.fields || []).map(f => <option key={f.name} value={f.name}>{f.name} ({f.type})</option>)}
                                </select>
                              </td>
                            ))}
                            <td className={`${TD} py-2 text-center`}>
                              <div className="h-10 inline-flex items-center">
                                <RowIconAction label="Xóa cột" onClick={() => update({ unionColumns: cfg.unionColumns.filter((_, k) => k !== j) })}><Trash2 className="w-4 h-4" /></RowIconAction>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
                {errorBox('union')}
                <button type="button" className={`${BTN_OUTLINE} mt-3`} onClick={() => update({ unionColumns: [...cfg.unionColumns, { name: '', refs: {} }] })}>
                  <Plus className="w-4 h-4" /> Thêm cột
                </button>
              </div>
            )}
            {errorBox('combine')}

            {/* Điều kiện lọc (WHERE) – 1 bộ chung trên kết quả kết hợp */}
            <div>
              <div className={`${LABEL_CLS} mb-2`}>Điều kiện lọc (WHERE)</div>
              {cfg.filters.length > 0 && (
                <div className={`${TABLE_WRAP_CLS} mb-3`}>
                  <table className="w-full border-collapse collection-table text-[13px]">
                    <thead className={TABLE_HEAD_BG}>
                      <tr className={TABLE_HEAD_ROW_CLS}>
                        <th className={`${TH} w-14 !text-center`}>STT</th>
                        <th className={TH}>Cột</th>
                        <th className={`${TH} w-[210px]`}>Điều kiện</th>
                        <th className={TH}>Giá trị</th>
                        <th className={`${TH} w-[80px] !text-center`}>Thao tác</th>
                      </tr>
                    </thead>
                    <tbody>
                      {cfg.filters.map((f, k) => (
                        <tr key={k} className={EDIT_ROW}>
                          <td className={`${TD} py-2 leading-10 text-center`}>{k + 1}</td>
                          <td className={`${TD} py-2`}>
                            <select aria-label={`Cột lọc ${k + 1}`} className={INPUT_CLS} value={f.field} onChange={e => setWhere(k, { field: e.target.value })}>
                              <option value="" disabled hidden>-- Chọn cột --</option>
                              {resultCols.map(o => <option key={o.ref} value={o.ref}>{o.label} ({o.type})</option>)}
                            </select>
                          </td>
                          <td className={`${TD} py-2`}>
                            <select aria-label={`Điều kiện lọc ${k + 1}`} className={INPUT_CLS} value={f.operator}
                              onChange={e => setWhere(k, { operator: e.target.value as FilterOperator, value: filterNeedsValue(e.target.value as FilterOperator) ? f.value : '' })}>
                              {(Object.keys(FILTER_OPERATOR_LABEL) as FilterOperator[]).map(o => <option key={o} value={o}>{FILTER_OPERATOR_LABEL[o]}</option>)}
                            </select>
                          </td>
                          <td className={`${TD} py-2`}>
                            <input aria-label={`Giá trị lọc ${k + 1}`} className={INPUT_CLS} value={f.value} disabled={!filterNeedsValue(f.operator)}
                              placeholder={filterNeedsValue(f.operator) ? (f.operator === 'in' ? 'Giá trị 1; Giá trị 2' : 'Nhập giá trị') : ''}
                              onChange={e => setWhere(k, { value: e.target.value })} />
                          </td>
                          <td className={`${TD} py-2 text-center`}>
                            <div className="h-10 inline-flex items-center">
                              <RowIconAction label="Xóa điều kiện lọc" onClick={() => update({ filters: cfg.filters.filter((_, n) => n !== k) })}><Trash2 className="w-4 h-4" /></RowIconAction>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              {errorBox('where')}
              <button type="button" className={BTN_OUTLINE} onClick={() => update({ filters: [...cfg.filters, emptyWhere()] })}>
                <Plus className="w-4 h-4" /> Thêm điều kiện lọc
              </button>
            </div>
          </div>
        )}

        {/* ⑤ Bảng đích & ánh xạ – mỗi cột đích 1 dòng: cấu trúc (bảng mới sửa được) + cách lấy giá trị từ kết quả kết hợp */}
        {step === 5 && (
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-x-6 gap-y-4">
              <div>
                <label className={LABEL_CLS}>CSDL đích <span className={REQUIRED_MARK}>*</span></label>
                <select aria-label="CSDL đích" className={INPUT_CLS} value={cfg.targetDbId}
                  onChange={e => { const v = e.target.value; confirmTargetChange(() => update({ targetDbId: v, ...(tableMode === 'existing' ? { targetTable: '', ...resetMapping } : {}) })); }}>
                  <option value="" disabled hidden>-- Chọn CSDL đích --</option>
                  {initialTargetDatabases.filter(d => d.status === 'active').map(d => (
                    <option key={d.id} value={d.id}>{d.name} ({d.type} · {d.host}:{d.port})</option>
                  ))}
                </select>
                {errorBox('targetDb')}
              </div>
              <div>
                <div className={LABEL_CLS}>Bảng đích <span className={REQUIRED_MARK}>*</span></div>
                <div role="radiogroup" aria-label="Bảng đích" className="flex items-center gap-6 h-10">
                  {(['existing', 'new'] as const).map(m => (
                    <label key={m} className="inline-flex items-center gap-2 text-[13px] text-[#020817] cursor-pointer">
                      <input type="radio" name="table-mode" className={CHECKBOX} checked={tableMode === m} onChange={() => changeTableMode(m)} />
                      {m === 'existing' ? 'Chọn bảng có sẵn' : 'Tạo bảng mới'}
                    </label>
                  ))}
                </div>
              </div>
              {tableMode === 'existing' ? (
                <div>
                  <label className={LABEL_CLS}>Bảng <span className={REQUIRED_MARK}>*</span></label>
                  <select aria-label="Bảng" className={INPUT_CLS} value={cfg.targetTable} disabled={!cfg.targetDbId}
                    onChange={e => { const v = e.target.value; confirmTargetChange(() => update({ targetTable: v, ...resetMapping })); }}>
                    <option value="" disabled hidden>-- Chọn bảng --</option>
                    {mergeTargetTables.filter(t => t.dbId === cfg.targetDbId).map(t => (
                      <option key={t.name} value={t.name}>{t.name} – {t.description}</option>
                    ))}
                  </select>
                  {errorBox('targetTable')}
                </div>
              ) : (
                <div>
                  <label className={LABEL_CLS}>Tên bảng mới <span className={REQUIRED_MARK}>*</span></label>
                  <input className={INPUT_CLS} placeholder="VD: HS_KHAI_SINH_HOP_NHAT" value={newTableName}
                    onChange={e => setNewTableName(e.target.value.toUpperCase().replace(/\s+/g, '_'))} />
                  {errorBox('targetTable')}
                </div>
              )}
            </div>

            {(tableMode === 'new' || cfg.targetTable) && (
              <>
                <div className="flex items-start justify-between gap-3">
                  <p className={`flex items-start gap-2 ${HINT}`}>
                    <Info className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>
                      {tableMode === 'new'
                        ? 'Hệ thống tạo cột và ánh xạ sẵn theo kết quả bước Kết hợp; cột thêm sau thì tự chọn giá trị nguồn. '
                        : 'Chọn giá trị nguồn cho từng cột từ kết quả bước Kết hợp. '}
                      <strong className="text-[#020817] font-medium">Theo độ ưu tiên</strong>: lấy cột đầu tiên có dữ liệu. Cột không cho phép trống mà kết quả trống thì dòng đó không được ghi.
                    </span>
                  </p>
                  {tableMode === 'new' && (
                    <button type="button" className={`${BTN_OUTLINE} shrink-0`} onClick={recreateColumns}>
                      <Sparkles className="w-4 h-4" /> Tạo lại cột theo kết quả kết hợp
                    </button>
                  )}
                </div>
                {errorBox('columns')}
                {errorBox('mapping')}
                <div className={TABLE_WRAP_CLS}>
                  <div className="max-h-[420px] overflow-y-auto custom-scrollbar">
                    <table className="w-full border-collapse collection-table text-[13px]">
                      <thead className={`${TABLE_HEAD_BG} sticky top-0 z-[1]`}>
                        <tr className={TABLE_HEAD_ROW_CLS}>
                          <th className={`${TH} ${tableMode === 'new' ? 'w-[180px]' : ''}`}>Cột đích</th>
                          <th className={`${TH} ${tableMode === 'new' ? 'w-[160px]' : ''}`}>Kiểu dữ liệu</th>
                          <th className={`${TH} !text-center w-[80px]`}>Cho phép trống</th>
                          <th className={`${TH} !text-center w-[80px]`}>Khóa chính</th>
                          <th className={`${TH} w-[170px]`}>Cách lấy</th>
                          <th className={`${TH} min-w-[280px]`}>Giá trị nguồn</th>
                          {tableMode === 'new' && <th className={`${TH} w-[70px] !text-center`}>Thao tác</th>}
                        </tr>
                      </thead>
                      <tbody>
                        {targetColumns.map((t, i) => {
                          const m = mapOf(t.name);
                          const optionalOnly = !t.isKey && !t.nullable && m.mode !== 'fixed' && m.columns.length > 0 && m.columns.every(r => isOptionalColumn(cfg, r));
                          const missing = !!errors.mapping && !t.isKey && !t.nullable && !!t.name && !mappingFilled(cfg.mappings[t.name]);
                          return (
                            <tr key={tableMode === 'new' ? i : t.name} className={`${EDIT_ROW} ${t.isKey ? '!bg-[#F8FAFC]' : ''}`}>
                              {tableMode === 'new' ? (
                                <>
                                  <td className={`${TD} py-2`}>
                                    <input aria-label={`Tên cột ${i + 1}`} className={`${INPUT_CLS} font-mono`} value={t.name}
                                      onChange={e => setNewCol(i, { name: e.target.value.toUpperCase().replace(/\s+/g, '_') })} />
                                  </td>
                                  <td className={`${TD} py-2`}>
                                    <input aria-label={`Kiểu dữ liệu cột ${i + 1}`} className={`${INPUT_CLS} font-mono`} placeholder="VD: NVARCHAR2(200)" value={t.type}
                                      onChange={e => setNewCol(i, { type: e.target.value.toUpperCase() })} />
                                  </td>
                                  <td className={`${TD} py-2 text-center leading-10`}>
                                    <input type="checkbox" aria-label={`Cho phép trống cột ${i + 1}`} className={CHECKBOX} disabled={t.isKey}
                                      checked={!t.isKey && !!t.nullable} onChange={e => setNewCol(i, { nullable: e.target.checked })} />
                                  </td>
                                  <td className={`${TD} py-2 text-center leading-10`}>
                                    <input type="radio" name="new-table-key" aria-label={`Khóa chính cột ${i + 1}`} className={CHECKBOX}
                                      checked={!!t.isKey} onChange={() => setNewCol(i, { isKey: true, nullable: false })} />
                                  </td>
                                </>
                              ) : (
                                <>
                                  <td className={`${TD} py-2 leading-10 font-mono whitespace-nowrap`}>{t.name}</td>
                                  <td className={`${TD} py-2 leading-10 font-mono whitespace-nowrap text-[#64748B]`}>{t.type}</td>
                                  <td className={`${TD} py-2 leading-10 text-center`}>{t.isKey ? '–' : t.nullable ? 'Có' : <span className="font-medium text-[#B45309]">Không</span>}</td>
                                  <td className={`${TD} py-2 leading-10 text-center`}>{t.isKey ? <KeyRound className="w-4 h-4 inline text-blue-600" aria-label="Khóa chính" /> : ''}</td>
                                </>
                              )}
                              {t.isKey ? (
                                <>
                                  <td className={`${TD} py-2`}>
                                    <select aria-label="Cách lấy khóa chính" className={INPUT_CLS} value={cfg.targetKey.mode}
                                      onChange={e => update({ targetKey: { mode: e.target.value as 'auto' | 'column', column: '' } })}>
                                      <option value="auto">Tự động</option>
                                      <option value="column">Theo cột</option>
                                    </select>
                                  </td>
                                  <td className={`${TD} py-2`}>
                                    {cfg.targetKey.mode === 'auto' ? (
                                      <input aria-label="Giá trị khóa chính" className={`${INPUT_CLS} ${VIEW_FIELD_CLS}`} disabled value="Hệ thống tự sinh" />
                                    ) : (
                                      <SearchableSelect value={cfg.targetKey.column} onChange={v => update({ targetKey: { mode: 'column', column: v } })}
                                        options={colOptions} ariaLabel="Cột làm khóa chính" placeholder="-- Chọn cột làm khóa chính --" searchPlaceholder="Tìm theo Bảng.Cột" contentClassName={POPOVER_Z} />
                                    )}
                                    {keyWarnings().map(w => <p key={w} className={WARN_TEXT}><AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" /> {w}</p>)}
                                    {errorBox('key')}
                                  </td>
                                </>
                              ) : !t.name ? (
                                <td colSpan={2} className={`${TD} py-2 leading-10 text-[#64748B]`}>Nhập tên cột trước khi ánh xạ</td>
                              ) : (
                                <>
                                  <td className={`${TD} py-2`}>
                                    <select aria-label={`Cách lấy ${t.name}`} className={INPUT_CLS} value={m.mode}
                                      onChange={e => setMap(t.name, { mode: e.target.value as ValueMode, columns: e.target.value === 'fixed' ? [] : m.columns.slice(0, e.target.value === 'column' ? 1 : undefined) })}>
                                      {(Object.keys(VALUE_MODE_LABEL) as ValueMode[]).map(k => <option key={k} value={k}>{VALUE_MODE_LABEL[k]}</option>)}
                                    </select>
                                  </td>
                                  <td className={`${TD} py-2`}>
                                    {m.mode === 'column' && (
                                      <SearchableSelect value={m.columns[0] || ''} onChange={v => setMap(t.name, { columns: v ? [v] : [] })}
                                        options={[{ value: '', label: '-- Không ánh xạ --' }, ...colOptions]} ariaLabel={`Cột nguồn cho ${t.name}`}
                                        placeholder="-- Không ánh xạ --" searchPlaceholder="Tìm theo Bảng.Cột" contentClassName={POPOVER_Z} />
                                    )}
                                    {m.mode === 'priority' && (
                                      <PriorityPicker value={m.columns} options={resultCols} onChange={v => setMap(t.name, { columns: v })} label={`Cột ưu tiên cho ${t.name}`} />
                                    )}
                                    {m.mode === 'fixed' && (
                                      <input aria-label={`Giá trị cố định cho ${t.name}`} className={INPUT_CLS} placeholder="VD: Khách hàng" value={m.value}
                                        onChange={e => setMap(t.name, { value: e.target.value })} />
                                    )}
                                    {optionalOnly && <p className={WARN_TEXT}><AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" /> Cột nguồn có thể trống (bảng nối Left / Full Join): dòng trống sẽ không được ghi.</p>}
                                    {missing && <p className={ERROR_TEXT}>Cột không cho phép trống, vui lòng ánh xạ</p>}
                                  </td>
                                </>
                              )}
                              {tableMode === 'new' && (
                                <td className={`${TD} py-2 text-center`}>
                                  <div className="h-10 inline-flex items-center">
                                    <RowIconAction label="Xóa cột" onClick={() => removeNewCol(i)}><Trash2 className="w-4 h-4" /></RowIconAction>
                                  </div>
                                </td>
                              )}
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
                <div className="flex items-start justify-between gap-3">
                  {tableMode === 'new' ? (
                    <button type="button" className={BTN_OUTLINE}
                      onClick={() => update({ newTableColumns: [...(cfg.newTableColumns || []), { name: '', type: 'NVARCHAR2(200)', nullable: true }] })}>
                      <Plus className="w-4 h-4" /> Thêm cột
                    </button>
                  ) : <span />}
                  <p className={`${HINT} text-right`}>+ {TECH_COLUMNS.length} cột hệ thống tự ghi: {TECH_COLUMNS.map(t => t.name).join(', ')}</p>
                </div>
              </>
            )}

            {/* Khi trùng khóa chính – chỉ khi khóa lấy theo cột */}
            {cfg.targetKey.mode === 'column' && (
              <div className="rounded-2xl border border-[#E2E8F0] bg-white p-4 space-y-3">
                <h4 className={SECTION_TITLE + ' !mb-0'}>Khi trùng khóa chính</h4>
                <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                  <div>
                    <label className={LABEL_CLS}>Cách xử lý</label>
                    <select aria-label="Khi trùng khóa chính" className={INPUT_CLS} value={cfg.duplicateRule}
                      onChange={e => update({ duplicateRule: e.target.value as DuplicateRule, sourcePriority: cfg.sourcePriority.length ? cfg.sourcePriority : selectedIds })}>
                      {(Object.keys(DUPLICATE_RULE_LABEL) as DuplicateRule[]).map(k => <option key={k} value={k}>{DUPLICATE_RULE_LABEL[k]}</option>)}
                    </select>
                  </div>
                  {cfg.duplicateRule === 'latest' && (
                    <div>
                      <label className={LABEL_CLS}>Cột căn cứ thời gian <span className={REQUIRED_MARK}>*</span></label>
                      <SearchableSelect value={cfg.duplicateTimeColumn} onChange={v => update({ duplicateTimeColumn: v })}
                        options={resultCols.filter(c => typeFamily(c.type) === 'ngày').map(c => ({ value: c.ref, label: c.label }))}
                        ariaLabel="Cột căn cứ thời gian" placeholder="-- Chọn cột ngày / thời gian --" searchPlaceholder="Tìm theo Bảng.Cột" contentClassName={POPOVER_Z} />
                      {errorBox('dup')}
                    </div>
                  )}
                </div>
                {cfg.duplicateRule === 'source_priority' && (
                  <div>
                    <div className={`${LABEL_CLS} mb-2`}>Thứ tự ưu tiên nguồn</div>
                    <ol className="space-y-2">
                      {(cfg.sourcePriority.length ? cfg.sourcePriority : selectedIds).filter(id => selectedIds.includes(id)).map((id, i, arr) => (
                        <li key={id} className="flex items-center gap-3 h-10 px-3 rounded-lg border border-[#E2E8F0] bg-white text-[13px]">
                          <span className="w-6 h-6 rounded-full bg-[#EAF3FF] text-blue-600 text-[12px] font-semibold flex items-center justify-center">{i + 1}</span>
                          <span className="flex-1 text-[#020817]">{findDataset(id)?.name} · <span className="text-[#64748B]">{findDataset(id)?.sourceDb}</span></span>
                          <button type="button" disabled={i === 0} className={`${BTN_OUTLINE} !h-8 !px-3`}
                            onClick={() => { const a = [...arr]; [a[i - 1], a[i]] = [a[i], a[i - 1]]; update({ sourcePriority: a }); }}>
                            Lên
                          </button>
                        </li>
                      ))}
                    </ol>
                  </div>
                )}
                <p className={HINT}>
                  {cfg.duplicateRule === 'latest' ? 'Dòng có thời gian mới hơn được giữ; cùng thời gian thì xét theo thứ tự nguồn. Dùng thời gian của dữ liệu để chạy lại bao nhiêu lần cũng cùng kết quả.'
                    : cfg.duplicateRule === 'error' ? 'Các dòng trùng khóa không được ghi và đưa vào danh sách lỗi.'
                      : 'Dòng không được chọn vẫn lưu ở vùng tạm; khi dòng đang giữ bị xóa ở nguồn, dòng kế tiếp được lấy lên thay.'}
                </p>
              </div>
            )}
          </div>
        )}

        </fieldset>

        {/* ⑥ Xem lại & lưu */}
        {step === 6 && (
          <div className="space-y-6">
            <div>
              <h4 className={SECTION_TITLE}>Thông tin chung</h4>
              <div className="grid grid-cols-3 gap-x-6 gap-y-4">
                <KV label="Tên cấu hình">{cfg.name || '-'}</KV>
                <KV label="Mã cấu hình">{cfg.code || '-'}</KV>
                <KV label="Loại nguồn"><Badge label={getSourceGroup(cfg.sources)} /></KV>
                <KV label="CSDL đích">{targetDb?.name || '-'}</KV>
                <KV label="Bảng đích"><span className="font-mono">{(tableMode === 'new' ? newTableName : cfg.targetTable) || '-'}</span>{tableMode === 'new' && ' (tạo mới)'}</KV>
                <KV label="Khóa chính"><span className="font-mono">{keyCol?.name || '-'} = {keyText}</span></KV>
                {cfg.targetKey.mode === 'column' && (
                  <KV label="Khi trùng khóa chính">
                    {DUPLICATE_RULE_LABEL[cfg.duplicateRule]}{cfg.duplicateRule === 'latest' && cfg.duplicateTimeColumn ? ` (${columnLabel(cfg, cfg.duplicateTimeColumn)})` : ''}
                  </KV>
                )}
              </div>
            </div>
            <div>
              <h4 className={SECTION_TITLE}>Kết hợp – {cfg.combineType === 'join' ? 'Join' : unionLabel(cfg.unionAll)}</h4>
              <div className="p-3 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] font-mono text-[12px] leading-6 text-[#020817] break-words">
                {cfg.combineType === 'join' ? (
                  <>
                    <div>{operandLabel(cfg.baseTable)}</div>
                    {cfg.joins.map(j => <div key={j.id} className="pl-4">{describeJoinStep(j)}</div>)}
                  </>
                ) : (
                  <div>{cfg.sources.map(s => operandLabel(s.datasetId)).join(` ${unionLabel(cfg.unionAll).toUpperCase()} `)} · {cfg.unionColumns.length} cột ghép</div>
                )}
                {whereText && <div>WHERE {whereText}</div>}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <h4 className={SECTION_TITLE}>Nguồn dữ liệu ({cfg.sources.length})</h4>
                <div className={TABLE_WRAP_CLS}>
                  <table className="w-full border-collapse collection-table text-[13px]">
                    <thead className={TABLE_HEAD_BG}>
                      <tr className={TABLE_HEAD_ROW_CLS}>
                        <th className={TH}>Bộ dữ liệu</th>
                        <th className={TH}>Khóa nguồn</th>
                        <th className={TH}>Xử lý nguồn</th>
                      </tr>
                    </thead>
                    <tbody>
                      {cfg.sources.map(s => {
                        const c = countRules(s.rules);
                        return (
                          <tr key={s.datasetId} className={ROW}>
                            <td className={`${TD} max-w-[220px]`}><TruncatedText text={findDataset(s.datasetId)?.name || ''} /></td>
                            <td className={`${TD} font-mono whitespace-nowrap`}>{sourceKeyOf(s).join(', ') || '-'}</td>
                            <td className={`${TD} whitespace-nowrap`}>{c.clean + c.standardize + c.transform
                              ? `${RULE_GROUP_LABEL.clean} ${c.clean} · ${RULE_GROUP_LABEL.standardize} ${c.standardize} · ${RULE_GROUP_LABEL.transform} ${c.transform}`
                              : <span className="text-[#64748B]">Dùng nguyên trạng</span>}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
              <div>
                <h4 className={SECTION_TITLE}>Ánh xạ ({targetColumns.filter(t => !t.isKey && mappingFilled(cfg.mappings[t.name])).length}/{targetColumns.filter(t => !t.isKey).length} cột)</h4>
                <div className={`${TABLE_WRAP_CLS} max-h-[260px] overflow-y-auto custom-scrollbar`}>
                  <table className="w-full border-collapse collection-table text-[13px]">
                    <thead className={`${TABLE_HEAD_BG} sticky top-0 z-[1]`}>
                      <tr className={TABLE_HEAD_ROW_CLS}>
                        <th className={TH}>Cột đích</th>
                        <th className={TH}>Cách lấy</th>
                        <th className={TH}>Nguồn</th>
                      </tr>
                    </thead>
                    <tbody>
                      {targetColumns.filter(t => !t.isKey).map(t => (
                        <tr key={t.name} className={ROW}>
                          <td className={`${TD} font-mono whitespace-nowrap`}>{t.name}</td>
                          <td className={`${TD} whitespace-nowrap`}>{mappingFilled(cfg.mappings[t.name]) ? VALUE_MODE_LABEL[cfg.mappings[t.name].mode] : '-'}</td>
                          <td className={`${TD} max-w-[260px]`}><TruncatedText text={describeMapping(cfg, cfg.mappings[t.name]) || '-'} className="font-mono" /></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            <p className={`flex items-start gap-2 ${HINT}`}>
              <Info className="w-4 h-4 shrink-0 mt-0.5" />
              Lịch chạy thiết lập bằng nút Thêm lịch biểu ở danh sách hoặc màn chi tiết sau khi lưu (giống màn Xử lý dữ liệu).
            </p>
          </div>
        )}
      </div>
      {pending && (
        <ConfirmModal
          isOpen
          onClose={() => setPending(null)}
          onConfirm={pending.onConfirm}
          type="warning"
          title={pending.title}
          subtitle="Thao tác này sẽ xóa dữ liệu đã nhập"
          message={pending.message}
          confirmText={pending.confirmText}
        />
      )}
    </BaseModal>
  );
}
