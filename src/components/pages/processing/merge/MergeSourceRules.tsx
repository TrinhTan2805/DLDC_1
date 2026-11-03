import { useEffect, useState, type ReactNode } from 'react';
import { ChevronDown, ChevronUp, Plus, Trash2, Eraser, ListChecks, Shuffle } from 'lucide-react';
import { BTN_FOCUS, BTN_OUTLINE, INPUT_CLS, LABEL_CLS, RowIconAction, tabClass } from '../../collection/collectionUi';
import {
  MergeSourceDataset, SourceRule, SourceRuleKind, RuleGroup, RULE_KINDS, RULE_INPUTS, RULE_GROUP_LABEL,
  countRules, inputEnabled, ruleIncomplete,
} from './mockDataMerge';

// Bước "Xử lý nguồn" của wizard hợp nhất: bố cục giống màn Xử lý dữ liệu (tab Làm sạch / Chuẩn hóa / Biến đổi,
// mỗi loại quy tắc là 1 khối thu gọn/mở rộng) nhưng quy tắc lưu trong cấu hình hợp nhất, không đụng chức năng cũ.

interface MergeSourceRulesProps {
  dataset: MergeSourceDataset;
  rules: SourceRule[];
  onChange: (rules: SourceRule[]) => void;
  showErrors: boolean;
}

const GROUP_ICON: Record<RuleGroup, typeof Eraser> = { clean: Eraser, standardize: ListChecks, transform: Shuffle };

// Khối quy tắc thu gọn/mở rộng (compomennt.md 5.6) — cùng kiểu RuleAccordion của màn Xử lý dữ liệu
function RuleBlock({ title, count, expanded, onToggle, children }: { title: string; count: number; expanded: boolean; onToggle: () => void; children: ReactNode }) {
  return (
    <div className="mb-4 w-full rounded-2xl border border-[#E2E8F0] bg-white">
      <button type="button" aria-expanded={expanded} onClick={onToggle}
        className={`w-full flex items-center justify-between gap-4 p-4 text-left rounded-2xl hover:bg-[#F8FAFC] transition-colors ${BTN_FOCUS}`}>
        <h4 className="text-[14px] font-semibold text-[#020817] flex items-center gap-2">
          {title}
          {count > 0 && <span className="min-w-6 h-5 px-1.5 rounded-full text-[12px] font-medium inline-flex items-center justify-center bg-blue-600 text-white">{count}</span>}
        </h4>
        {expanded ? <ChevronUp className="w-5 h-5 shrink-0 text-[#475569]" /> : <ChevronDown className="w-5 h-5 shrink-0 text-[#475569]" />}
      </button>
      {expanded && <div className="p-4 border-t border-[#E2E8F0]">{children}</div>}
    </div>
  );
}

let seq = 0;
const newId = () => `r-${Date.now()}-${seq++}`;

export function MergeSourceRules({ dataset, rules, onChange, showErrors }: MergeSourceRulesProps) {
  const [tab, setTab] = useState<RuleGroup>('clean');
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  // Đổi nguồn: mở sẵn các khối đã có quy tắc
  useEffect(() => {
    const open: Record<string, boolean> = {};
    rules.forEach(r => { open[r.kind] = true; });
    setExpanded(open);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataset.id]);

  const counts = countRules(rules);

  const addRule = (kind: SourceRuleKind) => {
    onChange([...rules, { id: newId(), kind, field: '' }]);
    setExpanded(prev => ({ ...prev, [kind]: true }));
  };
  const updateRule = (id: string, patch: Partial<SourceRule>) => onChange(rules.map(r => (r.id === id ? { ...r, ...patch } : r)));

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 border-b border-[#E2E8F0]">
        <div role="tablist" aria-label="Nhóm quy tắc" className="flex">
          {(Object.keys(RULE_GROUP_LABEL) as RuleGroup[]).map(g => {
            const Icon = GROUP_ICON[g];
            return (
              <button key={g} type="button" role="tab" aria-selected={tab === g} className={tabClass(tab === g)} onClick={() => setTab(g)}>
                <Icon className="w-5 h-5" /> {RULE_GROUP_LABEL[g]} ({counts[g]})
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex flex-col">
        {RULE_KINDS.filter(k => k.group === tab).map(k => {
          const list = rules.filter(r => r.kind === k.kind);
          const inputs = RULE_INPUTS[k.kind];
          return (
            <RuleBlock key={k.kind} title={k.title} count={list.length} expanded={!!expanded[k.kind]}
              onToggle={() => setExpanded(prev => ({ ...prev, [k.kind]: !prev[k.kind] }))}>
              <div className="space-y-4">
                {list.length === 0 && <p className="text-[13px] text-[#64748B]">Chưa có quy tắc</p>}
                {list.map(rule => {
                  const bad = showErrors && ruleIncomplete(rule);
                  return (
                    <div key={rule.id}>
                      <div className={`flex gap-4 items-end p-4 rounded-xl border bg-[#F8FAFC] ${bad ? 'border-[#DC2626]' : 'border-[#E2E8F0]'}`}>
                        {inputs.map(input => {
                          const enabled = inputEnabled(input, rule);
                          const value = String(rule[input.key] || '');
                          const set = (v: string) => updateRule(rule.id, { [input.key]: v });
                          return (
                            <div key={input.key} className="flex-1 min-w-0">
                              <label className={LABEL_CLS}>{input.label}</label>
                              {input.type === 'text' ? (
                                <input aria-label={input.label} className={INPUT_CLS} value={enabled ? value : ''} disabled={!enabled}
                                  placeholder={enabled ? 'Nhập giá trị' : ''} onChange={e => set(e.target.value)} />
                              ) : (
                                <select aria-label={input.label} className={INPUT_CLS} value={value} disabled={!enabled} onChange={e => set(e.target.value)}>
                                  <option value="" disabled hidden>-- Chọn --</option>
                                  {input.type === 'field'
                                    ? dataset.fields.map(f => <option key={f.name} value={f.name}>{f.name} ({f.type})</option>)
                                    : input.options?.map(o => <option key={o} value={o}>{o}</option>)}
                                </select>
                              )}
                            </div>
                          );
                        })}
                        <div className="flex items-center h-10 shrink-0">
                          <RowIconAction label="Xóa" onClick={() => onChange(rules.filter(r => r.id !== rule.id))}><Trash2 className="w-4 h-4" /></RowIconAction>
                        </div>
                      </div>
                      {bad && <p className="mt-1 text-[12px] text-[#DC2626]">Vui lòng nhập đầy đủ thông tin quy tắc</p>}
                    </div>
                  );
                })}
                <button type="button" onClick={() => addRule(k.kind)} className={BTN_OUTLINE}>
                  <Plus className="w-4 h-4" /> Thêm quy tắc
                </button>
              </div>
            </RuleBlock>
          );
        })}
      </div>
    </div>
  );
}
